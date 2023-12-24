const mongoose = require("mongoose");

// Semester Details
const semesterSchema = new mongoose.Schema({
  semname: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  papers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
    },
  ],
});

module.exports = mongoose.model("Semester", semesterSchema);
