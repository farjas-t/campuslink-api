const Semester = require("./../models/Semester");
const asyncHandler = require("express-async-handler");

// @desc Get Semester
// @route GET /Semester
// @access Private
const getSemesterById = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const semester = await Semester.findById(req.params.id)
    .select("-_id -__v")
    .exec();
  if (!semester) {
    return res.status(400).json({ message: "Semester Not Found." });
  }
  res.json(semester);
});

// @desc Create The Semester
// @route POST /Semester
// @access Private
const createSemester = asyncHandler(async (req, res) => {
  const { semname, department } = req.body;

  // Confirm Data
  if (!semname || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Semester.findOne({ semname }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Semester Name" });
  }

  const semesterObj = {
    semname,
    department,
  };

  // Create and Store New semester
  const semester = await Semester.create(semesterObj);

  if (semester) {
    res.status(201).json({ message: `New Semester ${semname} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Semester
// @route PATCH /Semester
// @access Private
const updateSemester = asyncHandler(async (req, res) => {
  const { id, semname, department } = req.body;

  // Confirm Data
  if (!id || !semname || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Semester
  const semester = await Semester.findById(id).exec();

  if (!semester) {
    return res.status(400).json({ message: "Semester not found" });
  }

  // Check for duplicate
  const duplicate = await Semester.findOne({ semname }).lean().exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Semester Name" });
  }

  semester.semname = semname;
  semester.department = department;

  await semester.save();

  res.json({ message: "Semester Updated" });
});

// @desc Delete Semester
// @route DELETE /Semester
// @access Private
const deleteSemester = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Semester ID required" });
  }

  const semester = await Semester.findById(id).exec();

  if (!semester) {
    return res.status(400).json({ message: "Semester not found" });
  }

  const result = await semester.deleteOne();

  res.json({ message: `${result.semname} deleted` });
});

module.exports = {
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
};
