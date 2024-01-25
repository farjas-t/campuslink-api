const express = require("express");
const router = express.Router();
const deptController = require("./../controllers/deptController");

router
  .route("/")
  .get(deptController.getAllDept)
  .post(deptController.createDept);

router
  .route("/:id")
  .get(deptController.getDeptById)
  .patch(deptController.updateDept)
  .delete(deptController.deleteDept);

router.route("/extra/count").get(deptController.countDept);

module.exports = router;
