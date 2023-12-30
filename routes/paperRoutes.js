const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

router
  .route("/:id")
  .get(paperController.getPaper)
  .patch(paperController.updatePaper)
  .delete(paperController.deletePaper);

router.route("/").post(paperController.createPaper);
router.route("/all").get(paperController.getAllPapers);
router
  .route("/department/:departmentId")
  .get(paperController.getPapersByDepartment);
router.route("/semester/:semesterId").get(paperController.getPapersBySemester);
router.route("/:paperId/students").get(paperController.getStudentsInPaper);

module.exports = router;
