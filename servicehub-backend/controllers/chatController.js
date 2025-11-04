const Chat = require("../models/Chatmodel");

const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const message = await Chat.create({ chatId, sender: req.user._id, text });
  res.status(201).json(message);
};

const getMessages = async (req, res) => {
  const messages = await Chat.find({ chatId: req.params.chatId }).populate(
    "sender"
  );
  res.json(messages);
};

module.exports = { sendMessage, getMessages };
