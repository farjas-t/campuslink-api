const moment = require("moment");
const asyncHandler = require("express-async-handler");
const Request = require("./../models/Request");

// Create a new request
const createRequest = asyncHandler(async (req, res) => {
  const { student, teacher, text } = req.body;
  // Confirm Data
  if (!student || !teacher || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const datetime = moment().format("DD/MM/YYYY h:mm A");

  const request = await Request.create({ student, teacher, text, datetime });

  res.status(201).json({ message: "Request sent successfully", request });
});

// Accept a request
const acceptRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { remark } = req.body;

  const request = await Request.findByIdAndUpdate(
    requestId,
    { $set: { status: "accepted", remark } },
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json({ message: "Request accepted successfully", request });
});

// Reject a request
const rejectRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { remark } = req.body;

  const request = await Request.findByIdAndUpdate(
    requestId,
    { $set: { status: "rejected", remark } },
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.json({ message: "Request rejected successfully", request });
});

// Controller for students to get their requests
const getStudentRequests = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const requests = await Request.find({ student: studentId })
    .populate("teacher")
    .sort({ createdAt: -1 })
    .exec();

  res.json({ requests });
});

// Controller for teachers to get pending requests
const getPendingRequests = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const pendingRequests = await Request.find({
    teacher: teacherId,
    status: "pending",
  })
    .populate({
      path: "student",
      select: "name",
      populate: {
        path: "department semester",
        select: "deptname semnum",
      },
    })
    .sort({ createdAt: -1 })
    .exec();

  res.json(pendingRequests);
});

// Controller for teachers to get replied requests
const getRepliedRequests = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const repliedRequests = await Request.find({
    teacher: teacherId,
    status: { $ne: "pending" },
  })
    .populate({
      path: "student",
      select: "name",
      populate: {
        path: "department semester",
        select: "deptname semnum",
      },
    })
    .sort({ createdAt: -1 })
    .exec();

  res.json(repliedRequests);
});

module.exports = {
  createRequest,
  acceptRequest,
  rejectRequest,
  getStudentRequests,
  getPendingRequests,
  getRepliedRequests,
};
