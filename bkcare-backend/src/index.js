const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database.js');
const authRoutes = require('./routes/authRoute.js');
const patientRoutes = require('./routes/patientRoute.js');
const doctorRoutes = require('./routes/doctorRoute.js');
const appointmentRoutes = require('./routes/appointmentRoute.js');
const clinicRoutes = require('./routes/clinicRoute.js');
const serviceRoutes = require('./routes/serviceRoute.js');
const messageRoutes = require('./routes/messageRoute.js');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/services', serviceRoutes); 
app.use('/api/messages', messageRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log(path.join(__dirname, 'uploads'));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
