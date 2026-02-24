const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

// ===============================
// Ensure Upload Directory Exists
// ===============================
const uploadDir = process.env.UPLOAD_PATH || 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===============================
// Storage Configuration
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ===============================
// File Filter (Images Only)
// ===============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400));
  }
};

// ===============================
// Multer Instance
// ===============================
const upload = multer({
  storage,
  limits: {
    fileSize:
      parseInt(process.env.MAX_FILE_SIZE) ||
      5 * 1024 * 1024, // 5MB default
  },
  fileFilter,
});

// ===============================
// Export Cleanly
// ===============================
module.exports = upload;