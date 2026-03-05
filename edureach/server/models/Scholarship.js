const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema(
  {
    state: { type: String, default: "" },
    caste: { type: String, default: "" },
    income: { type: String, default: "" },
    gender: { type: String, default: "" },
    course: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { _id: false }
);

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    provider: { type: String, default: "" },
    amount: { type: String, default: "" },
    deadline: { type: Date },
    description: { type: String, default: "" },
    eligibility: { type: eligibilitySchema, default: () => ({}) },
    applicationUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);
