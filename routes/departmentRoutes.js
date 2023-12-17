const express = require("express");
const router = express.Router();
const deptController = require("./../controllers/deptController");

router
  .route("/")
  .post(deptController.createDept)
  .patch(deptController.updateDept)
  .delete(deptController.deleteDept);

router.route("/:id").get(deptController.getDeptById);

module.exports = router;
