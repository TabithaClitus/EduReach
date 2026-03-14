const Mentor = require("../models/Mentor");
const MentorMatch = require("../models/MentorMatch");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/mentors/list — returns all mentor users merged with their Mentor profile
// Public route — no auth required
// Always returns data even if Mentor profile documents don't exist yet
exports.getMentorList = async (req, res) => {
  try {
    const { subject, language } = req.query;

    // Get all users with role mentor
    const users = await User.find({ role: 'mentor' }, 'name email profilePic language');
    const userIds = users.map(u => u._id);

    // Get all Mentor profiles for those users
    const profiles = await Mentor.find({ user: { $in: userIds } });
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user.toString()] = p; });

    // Merge user + profile into the standard Mentor-shape the frontend expects
    let result = users.map(u => {
      const p = profileMap[u._id.toString()] || {};
      return {
        _id: p._id || u._id,
        user: u,
        subjects: p.subjects || [],
        bio: p.bio || '',
        languages: p.languages || [],
        rating: p.rating || 0,
        totalSessions: p.totalSessions || 0,
      };
    });

    // Apply optional filters
    if (subject) result = result.filter(m => m.subjects.includes(subject));
    if (language) result = result.filter(m => m.languages.includes(language));

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors — list all with optional ?subject=&language= filters
exports.getMentors = async (req, res) => {
  try {
    const { subject, language } = req.query;
    const query = {};
    if (subject) query.subjects = subject;
    if (language) query.languages = language;

    const mentors = await Mentor.find(query).populate(
      "user",
      "name email profilePic language"
    );
    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mentors/request — student sends a request
exports.requestMentor = async (req, res) => {
  try {
    const { mentorUserId, subject } = req.body;
    const studentId = req.user._id;

    if (!mentorUserId) {
      return res.status(400).json({ success: false, message: 'mentorUserId is required.' });
    }

    const studentDoc = await User.findById(studentId);

    // Allow multiple mentors, but avoid duplicate active/pending request to the same mentor.
    const existingRequest = await MentorMatch.findOne({
      student: studentId,
      mentor: mentorUserId,
      status: { $in: ['pending', 'active'] },
    }).select('_id');
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already requested this mentor.' });
    }

    const mentor = await User.findById(mentorUserId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }

    // 1. Push request into mentor's requests array
    await User.findByIdAndUpdate(mentorUserId, {
      $push: {
        mentorshipRequests: {
          studentId: studentDoc._id,
          studentName: studentDoc.name,
          grade: studentDoc.grade || '',
          subject: subject || '',
          message: '',
          status: 'pending',
          createdAt: new Date(),
        },
      },
    });

    // 2. Keep student profile stable if already accepted; otherwise set pending for compatibility.
    if (!studentDoc.myMentor) {
      await User.findByIdAndUpdate(studentId, {
        mentorshipStatus: 'pending',
      });
    }

    // 3. Also create MentorMatch so the chat system continues to work
    const match = await MentorMatch.create({
      student: studentId,
      mentor: mentorUserId,
      subject: subject || '',
    });

    // 4. Real-time notification to mentor
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (io && userSockets) {
      const mentorSocketIds = userSockets.get(mentorUserId.toString());
      if (mentorSocketIds?.size > 0) {
        mentorSocketIds.forEach(sid => {
          io.to(sid).emit('mentorship-notification', {
            type: 'new-request',
            message: `📩 ${studentDoc.name} sent you a mentorship request`,
            matchId: match._id,
          });
        });
      }
    }

    res.status(201).json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/my-request — student gets their current request status
exports.getMyRequestStatus = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate('myMentor', 'name')
      .populate('requestedMentorId', 'name');
    res.json({
      success: true,
      mentorshipStatus: student.mentorshipStatus || 'none',
      myMentor: student.myMentor || null,
      requestedMentorId: student.requestedMentorId || null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/my-requests — student sees their outgoing requests (list view for My Requests tab)
exports.getMyRequests = async (req, res) => {
  try {
    const matches = await MentorMatch.find({ student: req.user._id })
      .populate('mentor', 'name email profilePic')
      .sort('-createdAt');
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/incoming — mentor sees incoming pending requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id);
    const pending = (mentor.mentorshipRequests || []).filter(r => r.status === 'pending');

    // Attach the MentorMatch _id so the frontend can call PATCH /mentors/request/:matchId
    const enriched = await Promise.all(pending.map(async (r) => {
      const match = await MentorMatch.findOne({
        mentor: req.user._id,
        student: r.studentId,
        status: 'pending',
      }).select('_id');
      return { ...r.toObject(), matchId: match?._id || null };
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/mentors/request/:matchId — mentor accepts or declines
// body: { status: "active"|"closed" }  OR  { action: "accepted"|"declined" }
exports.respondToRequest = async (req, res) => {
  try {
    // Support both old (status:"active"/"closed") and new (action:"accepted"/"declined") formats
    const rawAction = req.body.action || req.body.status;
    const isAccept = rawAction === 'active' || rawAction === 'accepted';
    const newMatchStatus = isAccept ? 'active' : 'closed';
    const newUserAction = isAccept ? 'accepted' : 'declined';

    const match = await MentorMatch.findById(req.params.matchId);
    if (!match)
      return res.status(404).json({ success: false, message: 'Match not found.' });

    if (match.mentor.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    // Update MentorMatch status
    match.status = newMatchStatus;
    await match.save();

    const studentId = match.student.toString();

    // Update mentor's embedded request record status
    await User.findOneAndUpdate(
      { _id: req.user._id, 'mentorshipRequests.studentId': match.student },
      { $set: { 'mentorshipRequests.$.status': newUserAction } }
    );

    // Update student's status
    if (isAccept) {
      await User.findByIdAndUpdate(studentId, {
        mentorshipStatus: 'accepted',
        myMentor: req.user._id,
      });
    } else {
      // Declined: recompute flags from remaining matches.
      const [anyActive, anyPending] = await Promise.all([
        MentorMatch.findOne({ student: studentId, status: 'active' }).sort('-updatedAt'),
        MentorMatch.findOne({ student: studentId, status: 'pending' }).sort('-updatedAt'),
      ]);

      if (anyActive) {
        await User.findByIdAndUpdate(studentId, {
          mentorshipStatus: 'accepted',
          myMentor: anyActive.mentor,
        });
      } else if (anyPending) {
        await User.findByIdAndUpdate(studentId, {
          mentorshipStatus: 'pending',
          requestedMentorId: anyPending.mentor,
          myMentor: null,
        });
      } else {
        await User.findByIdAndUpdate(studentId, {
          mentorshipStatus: 'none',
          requestedMentorId: null,
          myMentor: null,
        });
      }
    }

    // Real-time notification to student
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    if (io && userSockets) {
      const studentSocketIds = userSockets.get(studentId);
      if (studentSocketIds?.size > 0) {
        const mentorUser = await User.findById(match.mentor, 'name');
        const label = isAccept ? 'accepted ✅' : 'declined ❌';
        studentSocketIds.forEach(sid => {
          io.to(sid).emit('mentorship-notification', {
            type: 'request-response',
            status: newMatchStatus,
            message: `${mentorUser?.name || 'Your mentor'} has ${label} your mentorship request`,
            matchId: match._id,
          });
        });
      }
    }

    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/active-matches — active matches for current user (student or mentor)
exports.getActiveMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const matches = await MentorMatch.find({
      $or: [{ student: userId }, { mentor: userId }],
      status: "active",
    })
      .populate("student", "name email profilePic")
      .populate("mentor", "name email profilePic")
      .sort("-updatedAt");
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/messages/:matchId — chat history
exports.getMessages = async (req, res) => {
  try {
    const match = await MentorMatch.findById(req.params.matchId);
    if (!match)
      return res.status(404).json({ success: false, message: "Match not found." });

    const userId = req.user._id.toString();
    if (
      match.student.toString() !== userId &&
      match.mentor.toString() !== userId
    )
      return res.status(403).json({ success: false, message: "Not authorized." });

    const messages = await Message.find({ matchId: req.params.matchId })
      .populate("sender", "name profilePic")
      .sort("createdAt");
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mentors/rate/:matchId — student rates mentor, closes match
exports.rateMentor = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const match = await MentorMatch.findById(req.params.matchId);

    if (!match)
      return res.status(404).json({ success: false, message: "Match not found." });

    if (match.student.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ success: false, message: "Only the student can rate." });

    // Update mentor profile rating
    const mentor = await Mentor.findOne({ user: match.mentor });
    if (mentor) {
      const newTotal = mentor.totalSessions + 1;
      const newRating =
        (mentor.rating * mentor.totalSessions + rating) / newTotal;
      mentor.rating = Math.round(newRating * 10) / 10;
      mentor.totalSessions = newTotal;
      await mentor.save();
    }

    match.status = "closed";
    match.rating = rating;
    match.feedback = feedback || "";
    await match.save();

    res.json({ success: true, message: "Rating submitted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/my-mentor — student's active mentor match with full profile
exports.getMyMentor = async (req, res) => {
  try {
    const match = await MentorMatch.findOne({
      student: req.user._id,
      status: "active",
    })
      .populate("mentor", "name email profilePic")
      .lean();

    if (!match) return res.json({ success: true, data: null });

    // Attach mentor profile (subjects, bio, rating, etc.)
    const mentorProfile = await Mentor.findOne({ user: match.mentor._id }).lean();
    match.mentorProfile = mentorProfile || {};

    res.json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/pending — student's pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const matches = await MentorMatch.find({
      student: req.user._id,
      status: "pending",
    })
      .populate("mentor", "name email")
      .lean();
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mentors/my-students — mentor sees their accepted students
exports.getMyStudents = async (req, res) => {
  try {
    const mentor = await User.findById(req.user._id);
    const accepted = (mentor.mentorshipRequests || []).filter(r => r.status === 'accepted');
    res.json({ success: true, data: accepted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mentors/end/:matchId — student ends active mentorship
exports.endMentorship = async (req, res) => {
  try {
    const match = await MentorMatch.findById(req.params.matchId);
    if (!match) return res.status(404).json({ success: false, message: "Match not found." });
    if (match.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized." });
    match.status = "closed";
    await match.save();
    res.json({ success: true, message: "Mentorship ended." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
