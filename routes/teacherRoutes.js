const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router.route("/").post(teacherController.createNewTeacher);
router.route("/").patch(teacherController.updateTeacher);
router.route("/list").get(teacherController.getTeacherList);
router.route("/approve").get(teacherController.getNewTeachers);
router.route("/approve").patch(teacherController.approveTeacher);

router
  .route("/:id")
  .get(teacherController.getTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
