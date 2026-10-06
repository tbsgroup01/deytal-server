const GalleryItem = require("../models/GalleryItem");

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.findAll({
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = async (req, res) => {
  try {
    const { title, category, description, image, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Gallery item title is required" });
    }

    const item = await GalleryItem.create({
      title,
      category: category || "Office Environment",
      description: description || "",
      image: image || "",
      order: order || 0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res) => {
  try {
    const { title, category, description, image, order } = req.body;
    const item = await GalleryItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (image !== undefined) item.image = image;
    if (order !== undefined) item.order = order;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    await item.destroy();
    res.json({ message: "Gallery item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
