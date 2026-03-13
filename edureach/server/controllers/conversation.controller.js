const Conversation = require('../models/Conversation');

// GET /api/conversations — all conversations for current user, newest first
exports.getAll = async (req, res) => {
  try {
    const convos = await Conversation.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt createdAt');
    res.json({ conversations: convos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load conversations' });
  }
};

// GET /api/conversations/:id — single conversation with messages
exports.getOne = async (req, res) => {
  try {
    const convo = await Conversation.findOne({ _id: req.params.id, user: req.user.id });
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load conversation' });
  }
};

// POST /api/conversations — create new conversation
exports.create = async (req, res) => {
  try {
    const { title, messages } = req.body;
    const convo = await Conversation.create({ user: req.user.id, title, messages: messages || [] });
    res.status(201).json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

// PUT /api/conversations/:id — update messages
exports.update = async (req, res) => {
  try {
    const convo = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { messages: req.body.messages },
      { new: true }
    );
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ conversation: convo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update conversation' });
  }
};

// DELETE /api/conversations/:id
exports.remove = async (req, res) => {
  try {
    const convo = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
