const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendMessage, getMessages } = require("../controllers/chatController");

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, getMessages);

module.exports = router;
