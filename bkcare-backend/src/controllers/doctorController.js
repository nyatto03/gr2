const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Thêm bác sĩ (Chỉ admin có quyền truy cập)
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            role,
            specialty,
            workingHours,
            description,
            gender,      // Thêm gender
            birthDate,   // Thêm birthDate
        } = req.body;

        // Kiểm tra nếu bác sĩ đã tồn tại
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor already exists!" });
        }

        // Mật khẩu mặc định là số điện thoại
        const password = phone; // Sử dụng số điện thoại làm mật khẩu

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 8); // Mã hóa với 8 salt rounds

        // Tạo bác sĩ mới
        const doctor = new Doctor({
            name,
            email,
            phone,
            address,
            role: "doctor", // Xác định là bác sĩ
            specialty,
            workingHours,
            description,
            gender,        // Thêm gender
            birthDate,     // Thêm birthDate
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
        });

        // Lưu bác sĩ vào cơ sở dữ liệu
        await doctor.save();
        return res
            .status(201)
            .json({ message: "Doctor has been added successfully!" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while adding the doctor." });
    }
};



// Các phương thức khác không thay đổi
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find(); // Lấy tất cả bác sĩ từ cơ sở dữ liệu
        return res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message:
                    "An error occurred while retrieving the list of doctors.",
            });
    }
};

const getDoctorDetails = async (req, res) => {
    try {
        const doctorId = req.params.id;

        // Kiểm tra nếu bác sĩ tồn tại
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        return res.status(200).json(doctor);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message: "An error occurred while retrieving doctor details.",
            });
    }
};

const updateDoctorDetails = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const {
            name,
            email,
            phone,
            address,
            specialty,
            workingHours,
            description,
            gender,      // Thêm gender
            birthDate,   // Thêm birthDate
        } = req.body;

        // Nếu có file ảnh trong request, lấy file đó từ req.file
        let image = req.file ? `/uploads/${req.file.filename}` : null;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.phone = phone || doctor.phone;
        doctor.address = address || doctor.address;
        doctor.image = image || doctor.image;
        doctor.specialty = specialty || doctor.specialty;
        doctor.workingHours = workingHours || doctor.workingHours;
        doctor.description = description || doctor.description;
        doctor.gender = gender || doctor.gender;         // Cập nhật gender
        doctor.birthDate = birthDate || doctor.birthDate; // Cập nhật birthDate

        // Lưu thay đổi vào cơ sở dữ liệu
        await doctor.save();

        return res
            .status(200)
            .json({
                message: "Doctor details have been updated successfully!",
            });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
                message: "An error occurred while updating doctor details.",
            });
    }
};


module.exports = {
    addDoctor,
    getAllDoctors,
    getDoctorDetails,
    updateDoctorDetails
};
