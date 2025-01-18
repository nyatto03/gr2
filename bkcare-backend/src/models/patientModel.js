const mongoose = require('mongoose');
const User = require("./userModel");

// Mô hình Bệnh nhân (Patient)
const patientSchema = new mongoose.Schema({
  medicalHistory: {
    type: String,
    default: null, // Đặt mặc định là null nếu không có giá trị
  },
  allergies: {
    type: String,
    default: null, // Đặt mặc định là null nếu không có giá trị
  },
  currentMedications: {
    type: String,
    default: null, // Đặt mặc định là null nếu không có giá trị
  },
  emergencyContact: {
    name: {
      type: String,
      default: null, // Đặt mặc định là null nếu không có giá trị
    },
    phone: {
      type: String,
      default: null, // Đặt mặc định là null nếu không có giá trị
    },
  },
});

// Sử dụng discriminator để phân biệt model Patient với User
const Patient = User.discriminator('Patient', patientSchema);

module.exports = Patient;
