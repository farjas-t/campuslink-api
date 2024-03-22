const express = require("express");
const router = express.Router();
const chatController = require("./../controllers/chatController");

router
  .route("/edit/:chatId")
  .patch(chatController.updateChat)
  .delete(chatController.deleteChat);

router
  .route("/:paperId")
  .get(chatController.getChat)
  .post(chatController.addChat);

module.exports = router;
