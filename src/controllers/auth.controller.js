const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "deytalsecretkey123", {
    expiresIn: "30d",
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Kripya email aur password dono enter karein." });
    }

    const adminExists = await Admin.findOne({ where: { email } });

    if (adminExists) {
      return res.status(400).json({ message: "Admin account with this email already exists." });
    }

    const admin = await Admin.create({
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin.id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin.id),
      });
    } else {
      res.status(401).json({ message: "Wrong Email ya Password!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin profile details (name, phone, logo)
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  const { name, phone, logo } = req.body;

  try {
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    if (name !== undefined) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (logo !== undefined) admin.logo = logo;

    await admin.save();

    res.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      phone: admin.phone,
      logo: admin.logo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/password
// @access  Private
const updateAdminPassword = async (req, res) => {
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    admin.password = password; // pre-save hooks will automatically hash it
    await admin.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
};
