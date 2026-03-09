const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
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
