const mongoose = require('mongoose');
const { Schema } = mongoose;
const Doctor = require('./doctorModel'); // Giả sử bạn đã có model bác sĩ

// Service model
const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL của ảnh dịch vụ
    required: true,
  },
  price: { // Trường giá dịch vụ
    type: Number,
    required: true,
  },
  relatedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Tham chiếu tới model Doctor
  }],
}, {
  timestamps: true, // Tạo thời gian tạo và cập nhật
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
