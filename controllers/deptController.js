const Dept = require("./../models/Department");
const asyncHandler = require("express-async-handler");

// @desc Get Dept
// @route GET /Dept
// @access Private
const getDeptById = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const dept = await Dept.findById(req.params.id).select("-_id -__v").exec();
  if (!dept) {
    return res.status(400).json({ message: "Department Not Found." });
  }
  res.json(dept);
});

// @desc Create The Department
// @route POST /Dept
// @access Private
const createDept = asyncHandler(async (req, res) => {
  const { deptname } = req.body;

  // Confirm Data
  if (!deptname) {
    return res.status(400).json({ message: "Department name required" });
  }

  // Check for Duplicates
  const duplicate = await Dept.findOne({ deptname }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Department Name" });
  }

  const deptObj = {
    deptname,
  };

  // Create and Store New dept
  const dept = await Dept.create(deptObj);

  if (dept) {
    res.status(201).json({ message: `${deptname} Department Created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Dept
// @route PATCH /Dept
// @access Private
const updateDept = asyncHandler(async (req, res) => {
  const { id, deptname } = req.body;

  // Confirm Data
  if (!id || !deptname) {
    return res.status(400).json({ message: "Dept ID and Name are required" });
  }

  // Find Dept
  const dept = await Dept.findById(id).exec();

  if (!dept) {
    return res.status(400).json({ message: "Department not found" });
  }

  // Check for duplicate
  const duplicate = await Dept.findOne({ deptname }).lean().exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Department Name" });
  }

  dept.deptname = deptname;

  await dept.save();

  res.json({ message: "Department Name Updated" });
});

// @desc Delete Dept
// @route DELETE /Dept
// @access Private
const deleteDept = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Department ID required" });
  }

  const dept = await Dept.findById(id).exec();

  if (!dept) {
    return res.status(400).json({ message: "Dept not found" });
  }

  const result = await dept.deleteOne();

  res.json({ message: `${result.deptname} deleted` });
});

module.exports = {
  getDeptById,
  createDept,
  updateDept,
  deleteDept,
};
