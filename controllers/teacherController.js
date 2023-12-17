const Teacher = require("./../models/Teacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get Teacher
// @route GET /teacher/:id
// @access Private
const getTeacher = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const teacher = await Teacher.findById(req.params.id)
    .select("-password -_id -__v")
    .lean();
  if (!teacher) {
    return res.status(404).json({ message: "No Teacher Found." });
  }
  res.json(teacher);
});

// @desc Get New Teachers for approval
// @route GET /teacher/approve/
// @access Private
const getNewTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({
    active: false,
  })
    .select("-password")
    .lean();
  if (!teachers?.length) {
    return res.status(404).json({ message: "New Teachers Not Found!" });
  }
  res.json(teachers);
});

// @desc Get Active Teacher List
// @route GET /teacher/list

const getTeacherList = asyncHandler(async (req, res) => {
  const teachersList = await Teacher.find({
    active: true,
  })
    .select("-password -_id -__v")
    .lean();
  if (!teachersList?.length) {
    return res.status(400).json({ message: "No Teacher(s) Found" });
  }
  res.json(teachersList);
});

// @desc Create New Teacher
// @route POST /Teacher
// @access Private
const createNewTeacher = asyncHandler(async (req, res) => {
  const { name, email, department, username, password } = req.body;

  // Confirm Data
  if (!name || !email || !department || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Teacher.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const teacherObj = {
    name,
    email,
    department,
    username,
    password: hashedPwd,
  };

  // Create and Store New teacher
  const teacher = await Teacher.create(teacherObj);

  if (teacher) {
    res.status(201).json({
      message: `New Teacher ${username} Registered. Waiting for approval`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Approve Teacher
// @route PATCH /teacher/approve
// @access Private
const approveTeacher = asyncHandler(async (req, res) => {
  const { id, active } = req.body;

  // Confirm Data
  if ((!id, typeof active !== "boolean")) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find Teacher
  const teacher = await Teacher.findById(id).exec();
  if (!teacher) {
    return res.status(400).json({ message: "User not found" });
  }

  teacher.active = true;

  await teacher.save();

  res.json({ message: "Teacher Approved" });
});

// @desc Update Teacher
// @route PATCH /teacher
// @access Private
const updateTeacher = asyncHandler(async (req, res) => {
  const { id, name, email, department, username, password, active } = req.body;

  // Confirm Data
  if (
    !id ||
    !name ||
    !email ||
    !department ||
    !username ||
    !password ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find Teacher
  const teacher = await Teacher.findById(id).exec();
  if (!teacher) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check duplicate
  const duplicate = await user.findOne({ username }).lean().exec();
  //Allow update to current user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  teacher.name = name;
  teacher.email = email;
  teacher.department = department;
  teacher.username = username;
  teacher.active = active;

  if (password) {
    // Hash Pwd
    teacher.password = await bcrypt.hash(password, 10);
  }
  const updatedTeacher = await teacher.save();

  res.json({ message: `Teacher ${updatedTeacher.username} Updated` });
});

// @desc Delete Teacher
// @route DELETE /Teacher
// @access Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Teacher ID Required" });
  }

  const teacher = await Teacher.findById(id).exec();

  if (!teacher) {
    return res.status(400).json({ message: "Teacher not found" });
  }

  const result = await teacher.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

module.exports = {
  getTeacher,
  getNewTeachers,
  getTeacherList,
  createNewTeacher,
  approveTeacher,
  updateTeacher,
  deleteTeacher,
};
