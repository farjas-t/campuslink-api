const express = require("express");
const router = express.Router();
const teacherEvalController = require("./../controllers/teacherEvalController");

router.put("/", teacherEvalController.submitTeacherEval);

router.get("/:teacherId", teacherEvalController.getTeacherEvalAverages);

module.exports = router;
