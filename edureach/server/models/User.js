const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "mentor", "admin"],
      default: "student",
    },
    language: {
      type: String,
      enum: ["en", "ta", "hi", "te", "kn", "ml"],
      default: "en",
    },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    school: { type: String, default: "" },
    grade: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    gender: { type: String, default: "" },
    caste: { type: String, default: "" },
    income: { type: String, default: "" },
    isRural: { type: Boolean, default: false },
    appliedScholarships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scholarship" }],

    // ── Streak & Badges ───────────────────────────────────────────────────────
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    longestStreak: { type: Number, default: 0 },
    badges: [{
      id: String,
      name: String,
      icon: String,
      earnedAt: { type: Date, default: Date.now },
    }],
    totalLessons: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    activities: [{
      icon: { type: String, default: '📌' },
      text: { type: String, required: true },
      type: { type: String, default: 'other' },
      createdAt: { type: Date, default: Date.now },
    }],

    // ── Mentorship status (student side) ─────────────────────────────────────
    mentorshipStatus: { type: String, enum: ['none', 'pending', 'accepted', 'declined'], default: 'none' },
    myMentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    requestedMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // ── Pending requests (mentor side) ────────────────────────────────────────
    mentorshipRequests: [{
      studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      studentName: String,
      grade:       String,
      subject:     String,
      message:     { type: String, default: '' },
      status:      { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
      createdAt:   { type: Date, default: Date.now },
    }],

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Password is hashed in the controller before User.create() — no pre-save hook needed.

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
