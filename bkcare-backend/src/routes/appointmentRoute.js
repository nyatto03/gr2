const express = require("express");
const {
    createAppointment,
    getDoctorAppointments,
    updateAppointment,
    getPatientAppointments,
} = require("../controllers/appointmentController.js");
const { authMiddleware } = require("../utils/authMiddleware.js");
const {
    isAdminOrDoctor,
    isAdminOrDoctorOrPatient,
} = require("../utils/roleMiddleware.js");

const router = express.Router();

// Đặt lịch khám (yêu cầu xác thực)
router.post("/", authMiddleware, createAppointment);

// Lấy danh sách các cuộc hẹn của bác sĩ (yêu cầu xác thực và quyền admin/doctor)
router.get(
    "/doctor/:doctorId",
    authMiddleware,
    isAdminOrDoctor,
    getDoctorAppointments
);

// Cập nhật trạng thái cuộc hẹn (yêu cầu xác thực và quyền admin/doctor)
router.put("/:id", authMiddleware, isAdminOrDoctorOrPatient, updateAppointment);

// Lấy danh sách các cuộc hẹn của bệnh nhân (yêu cầu xác thực)
router.get("/patient", authMiddleware, getPatientAppointments);

module.exports = router;
