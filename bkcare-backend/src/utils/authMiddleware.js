const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

console.log('Environment loaded:', process.env.JWT_SECRET);  // Kiểm tra sự tồn tại của JWT_SECRET


const authMiddleware = async (req, res, next) => {
    try {
        // Kiểm tra xem header Authorization có tồn tại không
        const token = req.header("Authorization")?.replace("Bearer ", "");

        // Nếu không có token
        if (!token) {
            return res
                .status(401)
                .send({ error: "Authentication token missing" });
        }

        // Giải mã và xác thực JWT
        const decoded = jwt.verify(token, secretKey);

        // Tìm người dùng dựa trên _id đã được giải mã trong token
        const user = await User.findOne({ _id: decoded._id });

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!user) {
            return res.status(401).send({ error: "User not found" });
        }

        // Gán đối tượng người dùng vào request để các route/middleware phía sau có thể sử dụng
        req.user = user;

        // Tiến hành chuyển sang middleware hoặc route handler tiếp theo
        next();
    } catch (error) {
        console.error("Lỗi xác thực:", error); // Ghi lại lỗi để tiện theo dõi
        res.status(401).send({ error: "Vui lòng xác thực" });
    }
};

module.exports = { authMiddleware };
