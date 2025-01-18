const Message = require('../models/messageModel'); // Import model Message

// Gửi tin nhắn
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body; // Lấy recipientId và nội dung tin nhắn từ body request

    if (!recipientId || !content) {
      return res.status(400).json({ error: "Recipient ID and content are required." });
    }

    // Tạo một tin nhắn mới và lưu vào cơ sở dữ liệu
    const message = new Message({
      senderId: req.user._id, // Sử dụng _id của người gửi từ token (authMiddleware đã xác thực)
      recipientId,
      content,
      timestamp: new Date(),
    });

    await message.save();

    // Trả về tin nhắn đã gửi
    return res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while sending the message." });
  }
};

// Lấy tin nhắn của người dùng
const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra xem người dùng có quyền lấy tin nhắn của người khác không
    if (req.user.role !== "admin" && req.user.role !== "doctor" && req.user._id.toString() !== userId) {
      return res.status(403).json({ error: "You do not have permission to view these messages." });
    }

    // Lấy tin nhắn của người dùng từ cơ sở dữ liệu
    const messages = await Message.find({ recipientId: userId }).sort({ timestamp: -1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found." });
    }

    // Trả về danh sách tin nhắn
    return res.status(200).json({ data: messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching messages." });
  }
};

module.exports = {
  sendMessage,
  getUserMessages,
};
