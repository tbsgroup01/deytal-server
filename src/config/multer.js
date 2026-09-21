const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure src/uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Save with unique name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (images and videos)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm|mov|mkv|avi|ogv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image|video/.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only image and video files are allowed!"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = upload;
