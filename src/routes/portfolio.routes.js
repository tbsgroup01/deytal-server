const express = require("express");
const router = express.Router();
const { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } = require("../controllers/portfolio.controller");
const { protect } = require("../middleware/auth.middleware");

router.route("/")
  .get(getPortfolios) // Public fetch
  .post(protect, createPortfolio);

router.route("/:id")
  .put(protect, updatePortfolio)
  .delete(protect, deletePortfolio);

module.exports = router;
