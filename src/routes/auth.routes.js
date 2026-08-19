const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, getAdminProfile);
router.put("/profile", protect, updateAdminProfile);
router.put("/password", protect, updateAdminPassword);

module.exports = router;
