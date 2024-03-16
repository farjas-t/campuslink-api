const express = require("express");
const router = express.Router();
const internalController = require("./../controllers/internalController");

//? Student Side
// get result of every course
router.route("/student/:studentId").get(internalController.getInternalStudent);

router
  .route("/:paper")
  .get(internalController.getInternal)
  .put(internalController.addInternal)
  .patch(internalController.updateInternal)
  .delete(internalController.deleteInternal);

router.route("/extra/count").get(internalController.countInternal);

module.exports = router;
