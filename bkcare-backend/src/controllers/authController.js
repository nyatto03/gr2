const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Đăng nhập người dùng
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Kiểm tra nếu số điện thoại và role của người dùng
    let user;
    if (req.body.role === "admin") {
      user = await User.findOne({ phone });
    } else if (req.body.role === "doctor") {
      user = await Doctor.findOne({ phone });
    } else if (req.body.role === "patient") {
      user = await Patient.findOne({ phone });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(400).json({ error: "Invalid phone number or password" });
    }

    // Kiểm tra mật khẩu có đúng không
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid phone number or password" });
    }

    // Tạo token JWT sau khi xác thực thành công
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "24h" });

    // Lấy thông tin người dùng để trả về (ẩn mật khẩu)
    const userResponse = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      image: user.image,
      status: user.status,
      gender: user.gender,
      birthDate: user.birthDate,
    };

    // Trả về người dùng và token, kèm theo thông tin bảng tương ứng
    res.status(200).json({
      user: userResponse,
      token,
      userDetail: user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed due to internal server error" });
  }
};

// Đăng ký người dùng
const register = async (req, res) => {
  try {
    const { name, phone, password, address, gender, birthDate } = req.body;

    // Kiểm tra nếu số điện thoại đã tồn tại trong bảng bệnh nhân
    const existingPatient = await Patient.findOne({ phone });
    if (existingPatient) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 8);

    // Tạo đối tượng bệnh nhân mới và lưu vào cơ sở dữ liệu
    const patient = new Patient({
      name,
      phone,
      password: hashedPassword,
      address,
      role: "patient",  // Chỉ tạo bệnh nhân, không phải user
      gender,
      birthDate,
    });
    await patient.save();

    // Tạo token JWT cho bệnh nhân mới
    const token = jwt.sign({ _id: patient._id }, secretKey, { expiresIn: "24h" });

    // Trả về bệnh nhân và token
    res.status(201).json({ patient, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
};

module.exports = {
  login,
  register,
};
