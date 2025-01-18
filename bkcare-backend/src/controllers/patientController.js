const Patient = require("../models/patientModel");
const User = require("../models/userModel");

// Add patient (Only admin or doctor can access)
const addPatients = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            role,
            medicalHistory,
            allergies,
            currentMedications,
            emergencyContact,
        } = req.body;

        // Check if the patient already exists
        const existingPatient = await User.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: "Patient already exists!" });
        }

        // Create a new patient
        const patient = new Patient({
            name,
            email,
            phone,
            address,
            role: "patient",
            medicalHistory,
            allergies,
            currentMedications,
            emergencyContact,
        });

        // Save the patient to the database
        await patient.save();
        return res
            .status(201)
            .json({ message: "Patient has been added successfully!" });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while adding the patient." });
    }
};

// Get all patients (Only admin or doctor can access)
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find(); // Get all patients from the database
        return res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while retrieving the list of patients.",
        });
    }
};

// Get patient details (Only admin, doctor, or the patient can access)
const getPatientDetails = async (req, res) => {
    try {
        const patientId = req.params.id;

        // Check if the patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        return res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while retrieving patient details.",
        });
    }
};

// Update patient details (Only the patient can update their own information)
const updatePatientDetails = async (req, res) => {
    try {
        const patientId = req.params.id;
        const {
            name,
            email,
            phone,
            address,
            medicalHistory,
            allergies,
            currentMedications,
            emergencyContact,
            gender,
            birthDate,
        } = req.body;

        // Nếu có file ảnh trong request, lấy file đó từ req.file
        let image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        // Cập nhật thông tin bệnh nhân
        patient.name = name || patient.name;
        patient.email = email || patient.email;
        patient.phone = phone || patient.phone;
        patient.address = address || patient.address;
        if (image) patient.image = image; // Update the image only if it's provided
        patient.medicalHistory = medicalHistory || patient.medicalHistory;
        patient.allergies = allergies || patient.allergies;
        patient.currentMedications =
            currentMedications || patient.currentMedications;
        patient.emergencyContact = emergencyContact || patient.emergencyContact;
        patient.gender = gender || patient.gender;
        patient.birthDate = birthDate || patient.birthDate;

        // Lưu thay đổi vào database
        await patient.save();

        return res.status(200).json({
            message: "Patient details have been updated successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating patient details.",
        });
    }
};

module.exports = {
    addPatients,
    getAllPatients,
    updatePatientDetails,
    getPatientDetails,
};
