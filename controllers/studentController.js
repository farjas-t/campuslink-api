const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all Student
// @route GET /Student
// @access Private
const getStudentById = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const student = await Student.findById(req.params.id)
    .select("-password -_id -__v")
    .exec();
  if (!student) {
    return res.status(400).json({ message: "Student Not Found." });
  }
  res.json(student);
});

// @desc Get all Student
// @route GET /Student
// @access Private
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().select("-password").lean();
  if (!students?.length) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students);
});

// @desc Create New Student
// @route POST /Student
// @access Private
const createNewStudent = asyncHandler(async (req, res) => {
  const { name, admno, rollno, semester, email, username, password } = req.body;

  // Confirm Data
  if (
    !name ||
    !email ||
    !admno ||
    !rollno ||
    !semester ||
    !username ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Student.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const studentObj = {
    name,
    email,
    admno,
    rollno,
    semester,
    username,
    password: hashedPwd,
  };

  // Create and Store New student
  const student = await Student.create(studentObj);

  if (student) {
    res.status(201).json({ message: `New Student ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Student
// @route PATCH /Student
// @access Private
const updateStudent = asyncHandler(async (req, res) => {
  const { id, name, admno, rollno, semester, email, username, password } =
    req.body;

  // Confirm Data
  if (
    !id ||
    !name ||
    !email ||
    !admno ||
    !rollno ||
    !semester ||
    !username ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Student
  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await Student.findOne({ username }).lean().exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  student.name = name;
  student.email = email;
  student.admno = admno;
  student.rollno = rollno;
  student.semester = semester;
  student.username = username;

  if (password) {
    // Hash Pwd
    student.password = await bcrypt.hash(password, 10);
  }

  await student.save();

  res.json({ message: "User Updated" });
});

// @desc Get Student by Username
// @route GET /students/username/:username
// @access Private
const getStudentByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const student = await Student.findOne({ username })
    .populate("semester")
    .select("-password -_id -__v")
    .exec();

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// @desc Delete Student
// @route DELETE /Student
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "Student not found" });
  }

  const result = await student.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

// @desc Get Papers of Student's Semester
// @route GET /students/:Id/papers
// @access Private
const getStudentPapers = asyncHandler(async (req, res) => {
  const { Id } = req.params;

  const student = await Student.findById(Id)
    .populate({
      path: "semester",
      populate: {
        path: "papers",
        model: "Paper",
      },
    })
    .exec();

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const papers = student.semester.papers;
  res.json(papers);
});

// @desc Get Teacher's Information
// @route GET /students/:Id/teachers
// @access Private
const getTeacherInfo = asyncHandler(async (req, res) => {
  const { Id } = req.params;

  const student = await Student.findById(Id)
    .populate({
      path: "semester",
      populate: {
        path: "papers",
        model: "Paper",
        populate: {
          path: "teacher",
          model: "Teacher",
        },
      },
    })
    .exec();

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const teachers = student.semester.papers.map((paper) => ({
    paperCode: paper.code,
    teacherName: paper.teacher.name,
    teacherEmail: paper.teacher.email,
  }));

  res.json(teachers);
});

module.exports = {
  getStudentById,
  getAllStudents,
  createNewStudent,
  updateStudent,
  getStudentByUsername,
  deleteStudent,
  getStudentPapers,
  getTeacherInfo,
};
