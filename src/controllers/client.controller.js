const Client = require("../models/Client");

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [["displayOrder", "ASC"], ["createdAt", "DESC"]],
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  const { name, website, logo, displayOrder, status, featured, alt } = req.body;

  try {
    if (!name || !logo) {
      return res.status(400).json({ message: "Name and Logo are required." });
    }

    const client = await Client.create({
      name,
      website: website || "",
      logo,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 1,
      status: status || "Active",
      featured: featured !== undefined ? featured : true,
      alt: alt || "",
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, website, logo, displayOrder, status, featured, alt } = req.body;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (name !== undefined) client.name = name;
    if (website !== undefined) client.website = website;
    if (logo !== undefined) client.logo = logo;
    if (displayOrder !== undefined) client.displayOrder = Number(displayOrder);
    if (status !== undefined) client.status = status;
    if (featured !== undefined) client.featured = featured;
    if (alt !== undefined) client.alt = alt;

    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.destroy();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
