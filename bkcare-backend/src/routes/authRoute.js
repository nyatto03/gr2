const express = require("express");
const { login, register } = require("../controllers/authController");

const router = express.Router();

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

module.exports = router;
