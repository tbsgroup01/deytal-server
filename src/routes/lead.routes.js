const express = require("express");
const router = express.Router();
const { getLeads, createLead, updateLeadStatus, deleteLead, bulkDeleteLeads } = require("../controllers/lead.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/")
  .get(protect, getLeads)
  .post(createLead); // Public creation

router.route("/bulk-delete")
  .post(protect, bulkDeleteLeads);

router.route("/:id")
  .put(protect, updateLeadStatus)
  .delete(protect, deleteLead);

module.exports = router;
