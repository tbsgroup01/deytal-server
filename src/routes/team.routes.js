const express = require("express");
const router = express.Router();
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/team.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/")
  .get(getTeamMembers)
  .post(protect, createTeamMember);

router.route("/:id")
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

module.exports = router;
