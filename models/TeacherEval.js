const mongoose = require("mongoose");

const teacherEvalSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    punctuality: {
      type: Number,
      min: 0,
      max: 100,
    },
    preparation: {
      type: Number,
      min: 0,
      max: 100,
    },
    effectiveness: {
      type: Number,
      min: 0,
      max: 100,
    },
    discipline: {
      type: Number,
      min: 0,
      max: 100,
    },
    interest: {
      type: Number,
      min: 0,
      max: 100,
    },
    explanation: {
      type: Number,
      min: 0,
      max: 100,
    },
    ictUsage: {
      type: Number,
      min: 0,
      max: 100,
    },
    examsAndProjects: {
      type: Number,
      min: 0,
      max: 100,
    },
    doubtsClarification: {
      type: Number,
      min: 0,
      max: 100,
    },
    portionCompletion: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const TeacherEval = mongoose.model("TeacherEval", teacherEvalSchema);

module.exports = TeacherEval;
