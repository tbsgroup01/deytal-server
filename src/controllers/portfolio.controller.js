const Portfolio = require("../models/Portfolio");

// @desc    Get all portfolios
// @route   GET /api/portfolio
// @access  Public
const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new portfolio item
// @route   POST /api/portfolio
// @access  Private
const createPortfolio = async (req, res) => {
  const { title, category, link, image, description, status, clientName, technologies, gallery } = req.body;

  try {
    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required." });
    }

    const portfolio = await Portfolio.create({
      title,
      category,
      link,
      image,
      description: description || "",
      status: status || "Completed",
      clientName: clientName || "",
      technologies: technologies || "",
      gallery: gallery || "",
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const { title, category, link, image, description, status, clientName, technologies, gallery } = req.body;

  try {
    const portfolio = await Portfolio.findByPk(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    if (title !== undefined) portfolio.title = title;
    if (category !== undefined) portfolio.category = category;
    if (link !== undefined) portfolio.link = link;
    if (image !== undefined) portfolio.image = image;
    if (description !== undefined) portfolio.description = description;
    if (status !== undefined) portfolio.status = status;
    if (clientName !== undefined) portfolio.clientName = clientName;
    if (technologies !== undefined) portfolio.technologies = technologies;
    if (gallery !== undefined) portfolio.gallery = gallery;

    const updatedPortfolio = await portfolio.save();
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolio = async (req, res) => {
  const { id } = req.params;

  try {
    const portfolio = await Portfolio.findByPk(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    await portfolio.destroy();
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
