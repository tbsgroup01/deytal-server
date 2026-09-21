const TeamMember = require("../models/TeamMember");

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.findAll({
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private
const createTeamMember = async (req, res) => {
  try {
    const { name, title, image, order } = req.body;

    if (!name || !title) {
      return res.status(400).json({ message: "Name and title are required" });
    }

    const member = await TeamMember.create({
      name,
      title,
      image: image || "",
      order: order || 0,
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private
const updateTeamMember = async (req, res) => {
  try {
    const { name, title, image, order } = req.body;
    const member = await TeamMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    if (name !== undefined) member.name = name;
    if (title !== undefined) member.title = title;
    if (image !== undefined) member.image = image;
    if (order !== undefined) member.order = order;

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await member.destroy();
    res.json({ message: "Team member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
