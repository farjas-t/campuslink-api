const express = require("express");
const router = express.Router();
const semesterController = require("./../controllers/semesterController");

router
  .route("/")
  .post(semesterController.createSemester)
  .patch(semesterController.updateSemester)
  .delete(semesterController.deleteSemester);

router.route("/:id").get(semesterController.getSemesterById);

module.exports = router;
