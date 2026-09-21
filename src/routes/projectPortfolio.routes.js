const express = require("express");
const router = express.Router();
const {
  getProjectPortfolios,
  createProjectPortfolio,
  updateProjectPortfolio,
  deleteProjectPortfolio,
} = require("../controllers/projectPortfolio.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/")
  .get(getProjectPortfolios)
  .post(protect, createProjectPortfolio);

router.route("/:id")
  .put(protect, updateProjectPortfolio)
  .delete(protect, deleteProjectPortfolio);

module.exports = router;
