const User = require('../models/User');

const ALL_BADGES = [
  { id: 'first_login',   name: 'First Step',      icon: '🎯', desc: 'Joined EduReach' },
  { id: 'streak_3',      name: '3 Day Streak',     icon: '🔥', desc: 'Active 3 days in a row' },
  { id: 'streak_7',      name: 'Week Warrior',     icon: '⚡', desc: 'Active 7 days in a row' },
  { id: 'streak_30',     name: 'Monthly Master',   icon: '🏆', desc: 'Active 30 days in a row' },
  { id: 'first_quiz',    name: 'Quiz Starter',     icon: '📝', desc: 'Completed first quiz' },
  { id: 'quiz_5',        name: 'Quiz Pro',         icon: '🧠', desc: 'Completed 5 quizzes' },
  { id: 'perfect_score', name: 'Perfect Score',    icon: '💯', desc: 'Got 100% on a quiz' },
  { id: 'first_mentor',  name: 'Mentor Matched',   icon: '🤝', desc: 'Connected with a mentor' },
  { id: 'study_plan',    name: 'Planner',          icon: '📅', desc: 'Generated a study plan' },
];

exports.updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const today     = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = user.streak || 0;
    if (lastActive === today) {
      // Already active today — no change
    } else if (lastActive === yesterday) {
      newStreak = (user.streak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const longest = Math.max(newStreak, user.longestStreak || 0);

    const existingBadgeIds = (user.badges || []).map(b => b.id);
    const newBadges = [];

    const badgeRules = [
      { id: 'first_login', name: 'First Step',    icon: '🎯', condition: true },
      { id: 'streak_3',    name: '3 Day Streak',  icon: '🔥', condition: newStreak >= 3 },
      { id: 'streak_7',    name: 'Week Warrior',  icon: '⚡', condition: newStreak >= 7 },
      { id: 'streak_30',   name: 'Monthly Master',icon: '🏆', condition: newStreak >= 30 },
    ];

    badgeRules.forEach(rule => {
      if (rule.condition && !existingBadgeIds.includes(rule.id)) {
        newBadges.push({ id: rule.id, name: rule.name, icon: rule.icon });
      }
    });

    await User.findByIdAndUpdate(user._id, {
      streak: newStreak,
      lastActiveDate: new Date(),
      longestStreak: longest,
      $push: { badges: { $each: newBadges } },
    });

    res.json({ success: true, streak: newStreak, longestStreak: longest, newBadges });
  } catch (err) {
    console.error('updateStreak error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStreakData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      streak: user.streak || 0,
      longestStreak: user.longestStreak || 0,
      badges: user.badges || [],
      totalLessons: user.totalLessons || 0,
      totalQuizzes: user.totalQuizzes || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.awardBadge = async (req, res) => {
  try {
    const { badgeId } = req.body;
    if (!badgeId) return res.status(400).json({ success: false, message: 'badgeId required' });

    const badgeDef = ALL_BADGES.find(b => b.id === badgeId);
    if (!badgeDef) return res.status(400).json({ success: false, message: 'Unknown badge' });

    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyEarned = (user.badges || []).some(b => b.id === badgeId);
    if (alreadyEarned) {
      return res.json({ success: true, awarded: false, message: 'Already earned' });
    }

    const newBadge = { id: badgeDef.id, name: badgeDef.name, icon: badgeDef.icon };
    await User.findByIdAndUpdate(user._id, { $push: { badges: newBadge } });

    res.json({ success: true, awarded: true, badge: newBadge });
  } catch (err) {
    console.error('awardBadge error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
