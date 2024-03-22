const Chat = require("../models/Chat");
const moment = require('moment');

// Controller function to retrieve chats for a particular paper
async function getChat(req, res) {
  try {
    const paperId = req.params.paperId;
    const chats = await Chat.find({ paper: paperId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller function to add a new chat
async function addChat(req, res) {
  try {
    const { paperId } = req.params;
    const { content, from } = req.body;
    const datetime = moment().format("DD/MM/YYYY h:mm A");
    const chat = new Chat({
      paper: paperId,
      content,
      from,
      datetime,
    });
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Controller function to update an existing chat
async function updateChat(req, res) {
  try {
    const chatId = req.params.chatId;
    const { content } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { content },
      { new: true }
    );
    res.json(updatedChat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Controller function to delete a chat
async function deleteChat(req, res) {
  try {
    const chatId = req.params.chatId;
    await Chat.findByIdAndDelete(chatId);
    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getChat,
  addChat,
  updateChat,
  deleteChat,
};
