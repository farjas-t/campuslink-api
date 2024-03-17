const Time_Schedule = require("./../models/TimeSchedule");
const Semester = require("./../models/Semester");
const Teacher = require("./../models/Teacher");
const Paper = require("./../models/Paper");
const asyncHandler = require("express-async-handler");

// @desc Get Time Schedule for a Semester
// @route GET /time-schedule/:sem_id
// @access Public
const getTimeSchedule = asyncHandler(async (req, res) => {
  const { sem_id } = req.params;

  // Check if the semester exists
  const semester = await Semester.findById(sem_id).exec();

  if (!semester) {
    return res.status(404).json({ message: "Semester not found" });
  }

  // Find the time schedule for the given semester
  const timeSchedule = await Time_Schedule.findOne({ semester: sem_id }).exec();

  if (!timeSchedule) {
    return res
      .status(404)
      .json({ message: "Time schedule not found for the specified semester" });
  }

  res.json(timeSchedule);
});

// @desc Update or Add Time Schedule for a Semester
// @route PUT /time-schedule/:semester
// @access Private
const addTimeSchedule = asyncHandler(async (req, res) => {
  const { semester } = req.params;
  const { schedule } = req.body;

  // Check if the semester exists
  const existingSemester = await Semester.findById(semester).exec();

  if (!existingSemester) {
    return res.status(404).json({ message: "Semester not found" });
  }

  // Check if a time schedule already exists for the given semester
  let existingTimeSchedule = await Time_Schedule.findOne({ semester }).exec();

  // If no time schedule exists, create a new one
  if (!existingTimeSchedule) {
    await Time_Schedule.create({
      semester,
      schedule,
    });

    return res
      .status(201)
      .json({ message: "Time schedule added successfully" });
  }

  // Update the existing time schedule for the given semester
  existingTimeSchedule = await Time_Schedule.findOneAndUpdate(
    { semester: semester },
    { schedule: schedule },
    { new: true }
  ).exec();

  res.status(200).json({
    message: "Time schedule updated successfully",
    data: existingTimeSchedule,
  });
});

// @desc Patch (Update) Time Schedule for a Semester
// @route PATCH /time-schedule/:sem_id
// @access Private
const updateTimeSchedule = asyncHandler(async (req, res) => {
  const { semester } = req.params;
  const { schedule } = req.body;

  // Check if the semester exists
  const existingSemester = await Semester.findById(semester).exec();

  if (!existingSemester) {
    return res.status(404).json({ message: "Semester not found" });
  }

  // Check if a time schedule already exists for the given semester
  const existingTimeSchedule = await Time_Schedule.findOne({
    semester: semester,
  }).exec();

  if (!existingTimeSchedule) {
    return res
      .status(404)
      .json({ message: "Time schedule not found for the specified semester" });
  }

  // Update specific values in the schedule array
  Object.keys(schedule).forEach((day) => {
    if (existingTimeSchedule.schedule[day]) {
      if (Array.isArray(existingTimeSchedule.schedule[day])) {
        schedule[day].forEach((value, index) => {
          if (value !== "") {
            existingTimeSchedule.schedule[day][index] = value;
          }
        });
      } else {
        console.log(`Warning: ${day} schedule is not a list`);
      }
    } else {
      console.log(
        `Warning: ${day} schedule does not exist in the existing time schedule`
      );
    }
  });

  // Save the updated time schedule
  await existingTimeSchedule.save();

  res.json({ message: "Time schedule updated successfully" });
});

// @desc Delete Time Schedule for a Semester
// @route DELETE /time-schedule/:sem_id
// @access Private
const deleteTimeSchedule = asyncHandler(async (req, res) => {
  const { sem_id } = req.params;

  // Check if the semester exists
  const semester = await Semester.findById(sem_id).exec();

  if (!semester) {
    return res.status(404).json({ message: "Semester not found" });
  }

  // Find and delete the time schedule for the given semester
  const timeSchedule = await Time_Schedule.findOneAndDelete({
    semester: sem_id,
  }).exec();

  if (!timeSchedule) {
    return res
      .status(404)
      .json({ message: "Time schedule not found for the specified semester" });
  }

  res.json({ message: "Time schedule deleted successfully" });
});

module.exports = {
  getTimeSchedule,
  addTimeSchedule,
  updateTimeSchedule,
  deleteTimeSchedule,
};
