const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

router
  .route("/")
  .post(teacherController.createNewTeacher)
  .patch(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

router.route("/:id").get(teacherController.getTeacherById);

module.exports = router;
