const Testimonial = require("../models/Testimonial");

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = async (req, res) => {
  const { name, project, rating, logo, designation, testimonial } = req.body;

  try {
    if (!name || !project || !rating || !testimonial) {
      return res.status(400).json({ message: "Name, project, rating, and testimonial are required." });
    }

    const item = await Testimonial.create({
      name,
      project,
      rating,
      logo: logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      designation: designation || "",
      testimonial,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, project, rating, logo, designation, testimonial } = req.body;

  try {
    const item = await Testimonial.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    if (name !== undefined) item.name = name;
    if (project !== undefined) item.project = project;
    if (rating !== undefined) item.rating = rating;
    if (logo !== undefined) item.logo = logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}`;
    if (designation !== undefined) item.designation = designation;
    if (testimonial !== undefined) item.testimonial = testimonial;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Testimonial.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await item.destroy();
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
