const mongoose = require("mongoose");

const moodLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "bad"],
      required: true,
    },
    note: { type: String, maxlength: 200, default: "" },
    sentimentScore: { type: Number },
    flagged: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodLog", moodLogSchema);
