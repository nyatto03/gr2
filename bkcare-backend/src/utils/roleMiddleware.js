const isAdmin = async (req, res, next) => {
  try {
    // Kiểm tra nếu người dùng không phải là admin
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Access denied. Admins only.' });
    }
    // Tiến hành tiếp tục request nếu là admin
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const isAdminOrDoctor = async (req, res, next) => {
  try {
    // Kiểm tra nếu người dùng không phải là admin hoặc doctor
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).send({ error: 'Access denied. Admins or Doctors only.' });
    }
    // Tiến hành tiếp tục request nếu là admin hoặc doctor
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const isPatient = async (req, res, next) => {
  try {
    // Kiểm tra nếu người dùng không phải là patient
    if (req.user.role !== 'patient') {
      return res.status(403).send({ error: 'Access denied. Patients only.' });
    }
    // Tiến hành tiếp tục request nếu là patient
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const isAdminOrPatient = async (req, res, next) => {
  try {
    // Kiểm tra nếu người dùng không phải là admin hoặc patient
    if (req.user.role !== 'admin' && req.user.role !== 'patient') {
      return res.status(403).send({ error: 'Access denied. Admins or Patients only.' });
    }
    // Tiến hành tiếp tục request nếu là admin hoặc patient
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

const isAdminOrDoctorOrPatient = async (req, res, next) => {
  try {
    // Kiểm tra nếu người dùng không phải là admin, bác sĩ hoặc bệnh nhân
    if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.role !== 'patient') {
      return res.status(403).send({ error: 'Access denied. Admins, Doctors or Patients only.' });
    }
    // Tiến hành tiếp tục request nếu là admin, doctor hoặc patient
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

module.exports = {
  isAdmin,
  isAdminOrDoctor,
  isPatient,
  isAdminOrPatient,
  isAdminOrDoctorOrPatient
};
