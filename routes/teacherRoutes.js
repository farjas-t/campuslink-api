const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router
  .route("/")
  .get(teacherController.getAllTeachers)
  .post(teacherController.createNewTeacher);

router
  .route("/:id")
  .get(teacherController.getTeacherById)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

router.route("/extra/count").get(teacherController.countTeachers);

module.exports = router;
