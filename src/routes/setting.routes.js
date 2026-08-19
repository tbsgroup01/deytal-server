const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/setting.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/")
  .get(getSettings) // Public fetch
  .put(protect, updateSettings);

module.exports = router;
