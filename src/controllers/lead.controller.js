const Lead = require("../models/Lead");

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  const { name, email, phone, website, budget, service, message } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required fields." });
    }

    const lead = await Lead.create({
      name,
      email,
      phone: phone || "",
      website: website || "",
      budget: budget || "",
      service: service || "",
      message: message || "",
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lead status & notes
// @route   PUT /api/leads/:id
// @access  Private
const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (status !== undefined) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.destroy();
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk delete leads
// @route   POST /api/leads/bulk-delete
// @access  Private
const bulkDeleteLeads = async (req, res) => {
  const { ids } = req.body;

  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No lead IDs provided" });
    }

    await Lead.destroy({
      where: {
        id: ids
      }
    });

    res.json({ message: "Leads deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
};
