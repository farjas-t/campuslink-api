const mongoose = require("mongoose");

// Schema for a day
const daySchema = new mongoose.Schema({
  monday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  tuesday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  wednesday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  thursday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  friday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
});

// Time Schedule of the The Class
const timeScheduleSchema = new mongoose.Schema({
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Semester",
  },
  schedule: daySchema,
});

module.exports = mongoose.model("Time_Schedule", timeScheduleSchema);
