const mongoose = require('mongoose');
const User = require("./userModel");

// Doctor model
const doctorSchema = new mongoose.Schema({
  specialty: {
    type: String,
    required: true, 
  },
  workingHours: [{
    day: { 
      type: String, 
      required: true, 
    },
    slots: [{
      startTime: { 
        type: String, 
        required: true,
      },
      endTime: { 
        type: String, 
        required: true, 
      },
      isBooked: { 
        type: Boolean, 
        default: false,
      },
    }],
  }],
  description: {
    type: String,
    required: true,
  }
});

const Doctor = User.discriminator("Doctor", doctorSchema);

module.exports = Doctor;
