const express = require("express");
const router = express.Router();
const requestController = require("./../controllers/requestController");

// Routes for students
router.post("/", requestController.createRequest);
router.get(
  "/student/:studentId/requests",
  requestController.getStudentRequests
);

// Routes for teachers
router.get(
  "/teacher/:teacherId/pending-requests",
  requestController.getPendingRequests
);
router.patch("/:requestId/accept", requestController.acceptRequest);
router.patch("/:requestId/reject", requestController.rejectRequest);
router.get(
  "/teacher/:teacherId/replied-requests",
  requestController.getRepliedRequests
);

module.exports = router;
