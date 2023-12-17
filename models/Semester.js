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
});

module.exports = mongoose.model("Semester", semesterSchema);
