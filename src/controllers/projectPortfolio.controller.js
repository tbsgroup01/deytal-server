const ProjectPortfolio = require("../models/ProjectPortfolio");

// @desc    Get all project portfolios
// @route   GET /api/project-portfolio
// @access  Public
const getProjectPortfolios = async (req, res) => {
  try {
    const projects = await ProjectPortfolio.findAll({
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project portfolio item
// @route   POST /api/project-portfolio
// @access  Private
const createProjectPortfolio = async (req, res) => {
  try {
    const { title, image, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await ProjectPortfolio.create({
      title,
      image: image || "",
      order: order || 0,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a project portfolio item
// @route   PUT /api/project-portfolio/:id
// @access  Private
const updateProjectPortfolio = async (req, res) => {
  try {
    const { title, image, order } = req.body;
    const project = await ProjectPortfolio.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project portfolio item not found" });
    }

    if (title !== undefined) project.title = title;
    if (image !== undefined) project.image = image;
    if (order !== undefined) project.order = order;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project portfolio item
// @route   DELETE /api/project-portfolio/:id
// @access  Private
const deleteProjectPortfolio = async (req, res) => {
  try {
    const project = await ProjectPortfolio.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project portfolio item not found" });
    }

    await project.destroy();
    res.json({ message: "Project portfolio item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectPortfolios,
  createProjectPortfolio,
  updateProjectPortfolio,
  deleteProjectPortfolio,
};
