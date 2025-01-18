const Clinic = require("../models/clinicModel");
const path = require("path");

// Lấy tất cả phòng khám
const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    return res.status(200).json(clinics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching clinics." });
  }
};

// Lấy thông tin chi tiết phòng khám
const getClinicDetails = async (req, res) => {
  try {
    const clinicId = req.params.id;
    const clinic = await Clinic.findById(clinicId);
    
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found." });
    }

    return res.status(200).json(clinic);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching clinic details." });
  }
};

// Thêm phòng khám mới
const createClinic = async (req, res) => {
  try {
    const { name, address, contact_number, email, description } = req.body;
    
    // Lấy danh sách ảnh đã tải lên (nếu có)
    const images = req.files ? req.files.map(file => file.path) : [];

    const newClinic = new Clinic({
      name,
      address,
      contact_number,
      email,
      description,
      images, // Lưu đường dẫn ảnh
    });

    await newClinic.save();
    return res.status(201).json({ message: "Clinic created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while creating the clinic." });
  }
};

// Cập nhật thông tin phòng khám
const updateClinic = async (req, res) => {
  try {
    const clinicId = req.params.id;
    const { name, address, contact_number, email, description } = req.body;

    // Lấy danh sách ảnh đã tải lên (nếu có)
    const images = req.files ? req.files.map(file => file.path) : [];

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found." });
    }

    clinic.name = name || clinic.name;
    clinic.address = address || clinic.address;
    clinic.contact_number = contact_number || clinic.contact_number;
    clinic.email = email || clinic.email;
    clinic.description = description || clinic.description;
    clinic.images = images.length > 0 ? images : clinic.images;  // Cập nhật ảnh nếu có

    await clinic.save();
    return res.status(200).json({ message: "Clinic updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the clinic." });
  }
};

module.exports = {
  getAllClinics,
  getClinicDetails,
  createClinic,
  updateClinic,
};
