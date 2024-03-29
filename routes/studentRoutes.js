const express = require("express");
const router = express.Router();
const studentController = require("./../controllers/studentController");

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createNewStudent);

router
  .route("/:id")
  .get(studentController.getStudentById)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

router.route("/extra/count").get(studentController.countStudents);

module.exports = router;
