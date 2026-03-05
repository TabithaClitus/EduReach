const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    subject: { type: String, default: "" },
    language: [{ type: String }],
    videoUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    tags: [{ type: String }],
    isFree: { type: Boolean, default: true },
    gradeLevel: { type: String, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
