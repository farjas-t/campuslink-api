const express = require("express");
const router = express.Router();
const timeScheduleController = require("./../controllers/timeScheduleController");

router
  .route("/:semester")
  .put(timeScheduleController.addTimeSchedule)
  .patch(timeScheduleController.updateTimeSchedule);
router
  .route("/:sem_id")
  .get(timeScheduleController.getTimeSchedule)
  .delete(timeScheduleController.deleteTimeSchedule);

module.exports = router;
