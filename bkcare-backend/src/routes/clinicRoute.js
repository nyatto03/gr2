const express = require('express');
const { getAllClinics, getClinicDetails, createClinic, updateClinic } = require('../controllers/clinicController.js');
const { authMiddleware } = require('../utils/authMiddleware.js');
const { isAdmin, isAdminOrDoctorOrPatient } = require('../utils/roleMiddleware.js');
const { upload } = require('../utils/uploadMiddleware.js');

const router = express.Router();

// Lấy danh sách phòng khám (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/", authMiddleware, isAdminOrDoctorOrPatient, getAllClinics);

// Lấy thông tin chi tiết phòng khám (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/:id", authMiddleware, isAdminOrDoctorOrPatient, getClinicDetails);

// Thêm phòng khám mới (yêu cầu quyền admin và upload ảnh)
router.post("/", authMiddleware, isAdmin, upload, createClinic);

// Cập nhật thông tin phòng khám (yêu cầu quyền admin và upload ảnh)
router.put("/clinic/:id", authMiddleware, isAdmin, upload, updateClinic);

module.exports = router;
