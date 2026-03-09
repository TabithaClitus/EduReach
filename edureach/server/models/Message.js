const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId:     { type: String, required: true },
  sender:     { type: String, required: true },
  senderRole: { type: String, enum: ["mentor", "student"] },
  senderName: { type: String },
  text:       { type: String, required: true },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
