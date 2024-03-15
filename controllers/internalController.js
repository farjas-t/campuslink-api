const { default: mongoose } = require("mongoose");
const Internal = require("./../models/Internal");
const asyncHandler = require("express-async-handler");

// @desc Get Internal Result
// @route GET /internal/:paper
// @access Everyone
const getInternal = asyncHandler(async (req, res) => {
  if (!req?.params?.paper) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const internal = await Internal.findOne({
    paper: req.params.paper,
  })
    .populate({
      path: "marks._id",
      model: "Student",
      select: "_id rollno name ",
    })
    .populate({
      path: "paper",
      model: "Paper",
      select: "paper",
    })
    .exec();
  if (!internal) {
    return res.status(404).json({
      message: "No Existing Record(s) found. Add New Record.",
    });
  }
  res.json(internal);
});

const getInternalStudent = asyncHandler(async (req, res) => {
  if (!req.params.studentId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  try {
    const internals = await Internal.find({})
      .populate({
        path: "paper",
        model: "Paper",
        select: "paper",
      })
      .exec();

    if (!internals || internals.length === 0) {
      return res.status(404).json({ message: "No Records Found." });
    }

    const papersAndInternals = [];

    internals.forEach((internal) => {
      internal.marks.forEach((mark) => {
        if (mark._id._id.toString() === req.params.studentId) {
          papersAndInternals.push({
            paper: internal.paper.paper, // Assuming 'paper' field contains the name of the paper
            internals: mark,
          });
        }
      });
    });

    if (papersAndInternals.length === 0) {
      return res
        .status(404)
        .json({ message: "No Records Found for the Specified Student ID." });
    }

    res.json(papersAndInternals);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

// @desc Add Internal
// @route POST /Internal
// @access Private
const addInternal = asyncHandler(async (req, res) => {
  const paper = req.params.paper;
  const { marks } = req.body;

  // Confirm Data
  if (!paper || !marks) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }
  // Check for Duplicates
  const duplicate = await Internal.findOne({
    paper: req.params.paper,
  })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Internal record already exists" });
  }

  const InternalObj = {
    paper,
    marks,
  };
  // Create and Store New teacher
  const record = await Internal.create(InternalObj);
  if (record) {
    res.status(201).json({
      message: `Internal Record  Added`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Internal
// @route PATCH /Internal
// @access Private
const updateInternal = asyncHandler(async (req, res) => {
  const paperId = req.params.paper;
  const { marks } = req.body;

  // Confirm Data
  if (!paperId || !marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Internal.findOne({ paper: paperId }).exec();
  if (!record) {
    return res.status(404).json({ message: "Internal record doesn't exist" });
  }

  record.marks = marks;

  const save = await record.save();
  if (save) {
    res.json({
      message: `Internal Record Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteInternal = asyncHandler(async (req, res) => {
  const id = req.params.paper;

  if (!id) {
    return res.status(400).json({ message: "Internal ID required" });
  }

  const record = await Internal.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Internal Record not found" });
  }

  await record.deleteOne();
  res.json({
    message: `Internal Record deleted`,
  });
});

// @desc Get count of number of Internals
// @route GET /internal/extra/count
// @access Private
const countInternal = asyncHandler(async (req, res) => {
  const internalCount = await Internal.countDocuments();
  res.json({ count: internalCount });
});

module.exports = {
  getInternal,
  getInternalStudent,
  addInternal,
  updateInternal,
  deleteInternal,
  countInternal,
};
