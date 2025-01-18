const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',  // Tham chiếu đến collection "Service"
    required: true,  // Nếu bắt buộc chọn dịch vụ
  },
  date: {
    type: String,  
    required: true,
  },
  time_slot: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'canceled'], 
    default: 'pending',
  },
  result: {
    type: String, 
    default: null, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
