const express = require('express');
const { getAllServices, getServiceDetails, createService, updateService } = require('../controllers/serviceController.js');
const { authMiddleware } = require('../utils/authMiddleware.js');
const { isAdmin, isAdminOrDoctorOrPatient } = require('../utils/roleMiddleware.js');
const { upload } = require('../utils/uploadMiddleware.js');

const router = express.Router();

// Lấy danh sách dịch vụ (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/" , getAllServices);

// Lấy thông tin chi tiết dịch vụ (Admin, bác sĩ, bệnh nhân đều có quyền truy cập)
router.get("/:id", getServiceDetails);

// Thêm dịch vụ mới (yêu cầu quyền admin và upload ảnh)
router.post("/", authMiddleware, isAdmin, upload, createService);

// Cập nhật thông tin dịch vụ (yêu cầu quyền admin và upload ảnh)
router.put("/:id", authMiddleware, isAdmin, upload, updateService);

module.exports = router;
