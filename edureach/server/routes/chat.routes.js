const express = require("express");
const router = express.Router();
const { getMessages, saveMessage, getRoomStatus, markRoomRead } = require("../controllers/chat.controller");

router.get("/:roomId/status", getRoomStatus);
router.post("/:roomId/read", markRoomRead);
router.get("/:roomId", getMessages);
router.post("/:roomId", saveMessage);

module.exports = router;
