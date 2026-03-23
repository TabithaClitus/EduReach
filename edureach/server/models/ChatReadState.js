const mongoose = require("mongoose");

const ChatReadStateSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    lastReadAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ChatReadStateSchema.index({ roomId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("ChatReadState", ChatReadStateSchema);