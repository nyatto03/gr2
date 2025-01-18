const express = require('express');
const { sendMessage, getUserMessages } = require('../controllers/messageController.js');
const { authMiddleware } = require('../utils/authMiddleware.js');

const router = express.Router();

// Gửi tin nhắn (Mọi người đều có quyền gửi tin nhắn)
router.post("/", authMiddleware, sendMessage);

// Lấy danh sách tin nhắn của người dùng (Bệnh nhân chỉ lấy tin nhắn của mình, Admin và bác sĩ có thể lấy tin nhắn của bệnh nhân)
router.get("/:userId", authMiddleware, getUserMessages);

module.exports = router;
