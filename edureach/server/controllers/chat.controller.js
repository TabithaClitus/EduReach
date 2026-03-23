const Message = require("../models/Message");
const ChatReadState = require("../models/ChatReadState");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomStatus = async (req, res) => {
  try {
    const userId = req.query.userId?.toString();
    const roomId = req.params.roomId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const [lastReadState, latestMessage] = await Promise.all([
      ChatReadState.findOne({ roomId, userId }),
      Message.findOne({ roomId }).sort({ createdAt: -1 }).select("createdAt"),
    ]);

    const unreadQuery = {
      roomId,
      sender: { $ne: userId },
    };

    if (lastReadState?.lastReadAt) {
      unreadQuery.createdAt = { $gt: lastReadState.lastReadAt };
    }

    const unreadCount = await Message.countDocuments(unreadQuery);

    res.json({
      roomId,
      userId,
      lastReadAt: lastReadState?.lastReadAt || null,
      latestMessageAt: latestMessage?.createdAt || null,
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markRoomRead = async (req, res) => {
  try {
    const userId = req.body.userId?.toString();
    const roomId = req.params.roomId;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const fallbackLatestMessage = await Message.findOne({ roomId }).sort({ createdAt: -1 }).select("createdAt");
    const requestedReadAt = req.body.readAt ? new Date(req.body.readAt) : null;
    const lastReadAt = requestedReadAt && !Number.isNaN(requestedReadAt.getTime())
      ? requestedReadAt
      : (fallbackLatestMessage?.createdAt || new Date());

    const state = await ChatReadState.findOneAndUpdate(
      { roomId, userId },
      { $set: { lastReadAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ roomId, userId, lastReadAt: state.lastReadAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    const { sender, senderRole, senderName, text } = req.body;
    const msg = await Message.create({
      roomId: req.params.roomId,
      sender,
      senderRole,
      senderName,
      text,
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
