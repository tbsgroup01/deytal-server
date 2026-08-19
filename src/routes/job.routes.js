const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect } = require("../middleware/auth.middleware");
const {
  sendOtp,
  verifyOtp,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/job.controller");

// Multer storage for CV Resumes (PDF, DOC, DOCX, Images)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cv-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const cvUpload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Real Email OTP Verification Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Applications Routes (Specific routes defined BEFORE parametric :id routes)
router.get("/applications", protect, getApplications);
router.patch("/applications/:id", protect, updateApplicationStatus);
router.delete("/applications/:id", protect, deleteApplication);
router.post("/apply", cvUpload.single("cvFile"), submitApplication);

// Job Openings Routes
router.get("/", getJobs);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
