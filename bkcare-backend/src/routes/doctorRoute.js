const express = require('express');
const { authMiddleware } = require('../utils/authMiddleware.js')
const { addDoctor, getAllDoctors, updateDoctorDetails, getDoctorDetails } = require('../controllers/doctorController.js');
const { isAdmin, isAdminOrDoctor, isAdminOrDoctorOrPatient } = require('../utils/roleMiddleware.js');
const { upload } = require('../utils/uploadMiddleware.js');

const router = express.Router();

// Thêm bác sĩ (Chỉ admin có quyền truy cập)
router.post("/", authMiddleware, isAdmin, addDoctor);

// Lấy danh sách bác sĩ (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/", getAllDoctors);

// Lấy chi tiết bác sĩ (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/:id", getDoctorDetails);

// Cập nhật thông tin bác sĩ (Chỉ admin hoặc bác sĩ có quyền truy cập)
router.put("/:id", authMiddleware, isAdminOrDoctor, upload, updateDoctorDetails);

module.exports = router;
