const mongoose = require("mongoose");

const speechSessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audioUrl: { type: String, default: "" },
    durationSeconds: { type: Number, default: 0 },
    stutterScore: { type: Number, min: 0, max: 100, default: 0 },
    fluencyScore: { type: Number, min: 0, max: 100, default: 0 },
    feedback: [{ type: String }],
    exercise: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SpeechSession", speechSessionSchema);
