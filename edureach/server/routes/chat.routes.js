const express = require("express");
const router = express.Router();
const { getMessages, saveMessage } = require("../controllers/chat.controller");

router.get("/:roomId", getMessages);
router.post("/:roomId", saveMessage);

module.exports = router;
