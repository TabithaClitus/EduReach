const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hoursPerWeek: { type: Number, default: 0 },
    resources: [{ type: String }],
  },
  { _id: false }
);

const dayScheduleSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    tasks: [{ type: String }],
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: { type: String, default: "" },
    subjects: [subjectSchema],
    weeklySchedule: [dayScheduleSchema],
    generatedByAI: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
