const Appointment = require("../models/appointmentModel.js");
const Doctor = require("../models/doctorModel.js");
const Patient = require("../models/patientModel.js");
const Service = require("../models/serviceModel.js"); // Thêm mô hình Service
const moment = require("moment");

// Tạo cuộc hẹn
const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, service_id, date, time_slot } = req.body;

        // Kiểm tra nếu bác sĩ, bệnh nhân và dịch vụ có tồn tại trong cơ sở dữ liệu
        const doctor = await Doctor.findById(doctor_id);
        const patient = await Patient.findById(patient_id);
        const service = await Service.findById(service_id); // Kiểm tra dịch vụ

        if (!doctor || !patient || !service) {
            return res
                .status(400)
                .json({ message: "Doctor, Patient, or Service not found." });
        }

        // Chuyển đổi ngày từ định dạng YYYY-MM-DD sang thứ trong tuần
        const dayOfWeek = moment(date).format("dddd"); // Trả về một số từ 0 (Chủ Nhật) đến 6 (Thứ Bảy)

        // Tìm kiếm lịch làm việc của bác sĩ vào ngày và thời gian được yêu cầu
        const workingDay = doctor.workingHours.find(
            (day) => day.day === dayOfWeek // So sánh ngày trong tuần (0 - Chủ Nhật, 6 - Thứ Bảy)
        );

        if (!workingDay) {
            return res
                .status(400)
                .json({ message: "Doctor is not available on this day." });
        }

        const slot = workingDay.slots.find(
            (slot) =>
                slot.startTime === time_slot.startTime &&
                slot.endTime === time_slot.endTime
        );

        if (!slot) {
            return res.status(400).json({ message: "Time slot not found." });
        }

        // Kiểm tra nếu thời gian đã được đặt
        if (slot.isBooked) {
            return res
                .status(400)
                .json({ message: "Time slot is already booked." });
        }

        // Tạo cuộc hẹn mới với dịch vụ
        const appointment = new Appointment({
            patient_id,
            doctor_id,
            service_id, // Lưu service_id
            date,
            time_slot,
        });

        // Lưu cuộc hẹn vào cơ sở dữ liệu
        await appointment.save();

        // Cập nhật trạng thái 'isBooked' của slot tương ứng
        slot.isBooked = true;

        // Lưu lại bác sĩ với lịch làm việc đã được cập nhật
        await doctor.save();

        return res
            .status(201)
            .json({ message: "Appointment created successfully!" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message: "An error occurred while creating the appointment.",
            });
    }
};

// Lấy danh sách cuộc hẹn của bác sĩ
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        // Lấy tất cả cuộc hẹn của bác sĩ theo doctorId và populate dịch vụ
        const appointments = await Appointment.find({ doctor_id: doctorId })
            .populate("patient_id", "name email phone image gender birthDate address emergencyContact")
            .populate("service_id", "name description"); // Thêm populate cho service_id
        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message: "An error occurred while retrieving appointments.",
            });
    }
};

// Cập nhật trạng thái cuộc hẹn
const updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { status, result } = req.body; // Nhận thêm trường result

        // Kiểm tra nếu trạng thái hợp lệ
        if (
            !["pending", "confirmed", "completed", "canceled"].includes(status)
        ) {
            return res.status(400).json({ message: "Invalid status." });
        }

        // Nếu trạng thái là 'completed', cần có kết quả (result)
        if (status === "completed" && !result) {
            return res
                .status(400)
                .json({ message: "Result is required for completed status." });
        }

        // Cập nhật trạng thái cuộc hẹn
        const appointment = await Appointment.findById(appointmentId).populate(
            "doctor_id"
        ); // Populate doctor_id để lấy thông tin bác sĩ

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        // Cập nhật trạng thái và kết quả (nếu có)
        appointment.status = status;
        if (result) {
            appointment.result = result; // Cập nhật kết quả nếu có
        }
        await appointment.save();

        // Nếu trạng thái là 'canceled' hoặc 'completed', cập nhật trạng thái 'isBooked' của slot
        if (status === "canceled" || status === "completed") {
            const doctor = appointment.doctor_id; // Lấy thông tin bác sĩ
            const dayOfWeek = moment(appointment.date).format("dddd"); // Chuyển đổi ngày sang thứ trong tuần

            const workingDay = doctor.workingHours.find(
                (day) => day.day === dayOfWeek
            );

            if (workingDay) {
                const slot = workingDay.slots.find(
                    (slot) =>
                        slot.startTime === appointment.time_slot.startTime &&
                        slot.endTime === appointment.time_slot.endTime
                );

                if (slot) {
                    // Đặt isBooked thành false khi hủy hoặc hoàn thành cuộc hẹn
                    slot.isBooked = false;
                    await doctor.save(); // Lưu lại bác sĩ với lịch làm việc đã cập nhật
                }
            }
        }

        return res.status(200).json({
            message: "Appointment updated successfully!",
            appointment,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message: "An error occurred while updating the appointment.",
            });
    }
};

// Lấy danh sách cuộc hẹn của bệnh nhân
const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user._id; // Lấy patientId từ thông tin người dùng đã xác thực

        // Lấy tất cả cuộc hẹn của bệnh nhân và populate dịch vụ
        const appointments = await Appointment.find({ patient_id: patientId })
            .populate("doctor_id", "name specialty phone")
            .populate("service_id", "name description"); // Thêm populate cho service_id
        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message:
                    "An error occurred while retrieving patient appointments.",
            });
    }
};

module.exports = {
    createAppointment,
    getDoctorAppointments,
    updateAppointment,
    getPatientAppointments,
};
