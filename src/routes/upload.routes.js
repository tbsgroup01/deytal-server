const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const multer = require("multer");

// POST /api/upload
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error during upload:", err);
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("Custom upload error:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: fileUrl
    });
  });
});

module.exports = router;
