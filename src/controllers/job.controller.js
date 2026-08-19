const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const nodemailer = require("nodemailer");

// Nodemailer transporter with Gmail SMTP
const mailUser = (process.env.EMAIL_USER || process.env.MAIL_USER).trim();
const mailPass = (process.env.EMAIL_PASS || process.env.MAIL_PASS).trim().replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailUser,
    pass: mailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// In-Memory OTP Store: email -> { otp: string, expiresAt: number }
const otpStore = new Map();

// ---------------------------------------------------------
// REAL EMAIL OTP CONTROLLERS (WITH SMART FALLBACK)
// ---------------------------------------------------------

// @desc    Send Real Email OTP via Nodemailer with Smart Fallback
// @route   POST /api/jobs/send-otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email address is required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Generate 4-digit numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

    // Store in-memory for verification
    otpStore.set(cleanEmail, { otp, expiresAt });

    // HTML Email Template
    const mailOptions = {
      from: `"Deytal Careers" <${mailUser}>`,
      to: cleanEmail,
      subject: `Your Verification Code: ${otp} - Deytal Careers`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #6366f1;">
            <h2 style="color: #1e1b4b; margin: 0; font-size: 24px; font-weight: 800;">DEYTAL CAREERS</h2>
            <p style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; tracking-wider;">Candidate Email Verification</p>
          </div>
          <div style="padding: 24px 0; text-align: center;">
            <p style="color: #334155; font-size: 15px; margin-bottom: 16px;">Use the verification code below to verify your email address and complete your application:</p>
            <div style="display: inline-block; background: #EEF2FF; color: #4338CA; font-size: 36px; font-weight: 800; letter-spacing: 10px; padding: 14px 32px; border-radius: 12px; border: 1px solid #C7D2FE;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8;">
            &copy; 2026 Deytal Inc. All rights reserved.
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[REAL GMAIL OTP SENT SUCCESS] OTP sent to ${cleanEmail}`);
      return res.json({
        success: true,
        message: `Verification OTP sent to ${cleanEmail}! Please check your email inbox/spam folder.`,
      });
    } catch (mailErr) {
      console.error("[GMAIL SMTP ERROR]:", mailErr.message);
      return res.status(500).json({
        message: mailErr.message || "Failed to send OTP email. Please check your email address.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to process OTP request." });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/jobs/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const storedData = otpStore.get(cleanEmail);

    if (!storedData) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    if (storedData.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check your code and try again." });
    }

    // Success - clean up OTP from store
    otpStore.delete(cleanEmail);
    res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------
// JOB OPENINGS CONTROLLERS
// ---------------------------------------------------------

// @desc    Get all active jobs (Public for UI) or all jobs (Private for Admin)
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { status: "Active" };
    const jobs = await Job.findAll({
      where: filter,
      order: [["createdAt", "DESC"]],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job opening
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, department, type, location, experience, salary, description, skills, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Job title is required." });
    }

    const job = await Job.create({
      title,
      department: department || "Engineering",
      type: type || "Full Time",
      location: location || "Noida",
      experience: experience || "1-3 Years",
      salary: salary || "Best in Industry",
      description: description || "",
      skills: skills || [],
      status: status || "Active",
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job opening
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { title, department, type, location, experience, salary, description, skills, status } = req.body;

    if (title !== undefined) job.title = title;
    if (department !== undefined) job.department = department;
    if (type !== undefined) job.type = type;
    if (location !== undefined) job.location = location;
    if (experience !== undefined) job.experience = experience;
    if (salary !== undefined) job.salary = salary;
    if (description !== undefined) job.description = description;
    if (skills !== undefined) job.skills = skills;
    if (status !== undefined) job.status = status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job opening
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------
// JOB APPLICATIONS CONTROLLERS
// ---------------------------------------------------------

// @desc    Submit a job application
// @route   POST /api/jobs/apply
const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, experience, location, coverLetter } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "Full Name, Email and Phone are required." });
    }

    let cvUrl = "";
    if (req.file) {
      cvUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    } else if (req.body.cvUrl) {
      cvUrl = req.body.cvUrl;
    }

    const application = await JobApplication.create({
      fullName,
      email,
      phone,
      position: position || "General Application",
      experience: experience || "Fresher",
      location: location || "",
      coverLetter: coverLetter || "",
      cvUrl,
      status: "New",
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all job applications (Admin Only)
// @route   GET /api/jobs/applications
const getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job application status (Admin Only)
// @route   PATCH /api/jobs/applications/:id
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (status !== undefined) application.status = status;

    const updated = await application.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job application (Admin Only)
// @route   DELETE /api/jobs/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
};
