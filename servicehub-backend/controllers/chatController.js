const Chat = require("../models/ChatModel");

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    if (!chatId || !text)
      return res.status(400).json({ message: "chatId and text required" });
    const message = await Chat.create({ chatId, sender: req.user._id, text });
    res.status(201).json(message);
  } catch (e) {
    console.error("sendMessage error:", e);
    res.status(500).json({ message: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Chat.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("sender");
    res.json(messages);
  } catch (e) {
    console.error("getMessages error:", e);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
