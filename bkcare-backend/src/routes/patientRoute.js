const express = require('express');
const { authMiddleware } = require("../utils/authMiddleware.js");
const { addPatients, getAllPatients, updatePatientDetails, getPatientDetails } = require("../controllers/patientController.js");
const { isAdminOrDoctor, isAdminOrDoctorOrPatient, isAdminOrPatient } = require("../utils/roleMiddleware.js");
const { upload } = require("../utils/uploadMiddleware.js");

const router = express.Router();

// Thêm bệnh nhân (Chỉ admin có quyền truy cập)
router.post("/", authMiddleware, isAdminOrDoctor, addPatients);

// Lấy danh sách bệnh nhân (Chỉ admin hoặc bác sĩ có quyền truy cập)
router.get("/", authMiddleware, isAdminOrDoctor, getAllPatients);

// Lấy chi tiết bệnh nhân (Chỉ admin hoặc bác sĩ, bệnh nhân có quyền truy cập)
router.get("/:id", authMiddleware, isAdminOrDoctorOrPatient, getPatientDetails);

// Cập nhật thông tin bệnh nhân (Chỉ bệnh nhân có quyền cập nhật thông tin của mình)
router.put("/:id", authMiddleware, isAdminOrPatient, upload, updatePatientDetails);

module.exports = router;
