const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kiểm tra và tạo thư mục 'uploads' nếu không tồn tại
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ file - lưu ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Kiểm tra file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);  // File hợp lệ
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh JPEG, JPG, PNG.'));
  }
};

// Khởi tạo multer với các cấu hình trên, cho phép tải lên tối đa 5 ảnh, mỗi ảnh tối đa 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // Giới hạn file size tối đa là 5MB
}).single('image');

// Xử lý lỗi khi upload không hợp lệ
upload.errors = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { upload };
