require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const { connectDB, sequelize } = require("./src/config/db");

// Import all models to register them with Sequelize before database sync
const Admin = require("./src/models/Admin");
const Lead = require("./src/models/Lead");
const Portfolio = require("./src/models/Portfolio");
const Client = require("./src/models/Client");
const Testimonial = require("./src/models/Testimonial");
const Setting = require("./src/models/Setting");
const Job = require("./src/models/Job");
const JobApplication = require("./src/models/JobApplication");

const app = express();

// Connect to MySQL
connectDB();

// Sync Database Tables & Seed Initial Admin
const FORCE_SYNC = process.env.FORCE_SYNC === "true" || process.env.DB_FORCE_SYNC === "true";
sequelize.sync({ force: FORCE_SYNC, alter: true })
    .then(async () => {
        if (FORCE_SYNC) {
            console.log("MySQL database tables force recreated from scratch successfully.");
        } else {
            console.log("MySQL database tables synced successfully.");
        }

        // Auto-seed default admin credential if the table is empty
        const adminCount = await Admin.count();
        if (adminCount === 0) {
            await Admin.create({
                email: "admin@deytal.com",
                password: "Deytal@1234"
            });
            console.log("Default admin account seeded successfully (admin@deytal.com / Deytal@1234).");
        }

        // Auto-seed initial jobs if Job table is empty
        const jobCount = await Job.count();
        if (jobCount === 0) {
            await Job.bulkCreate([
                {
                    title: "Frontend Developer",
                    department: "Engineering",
                    type: "Full Time",
                    location: "Noida / Hybrid",
                    experience: "1-3 Years",
                    salary: "₹4.5L - ₹8L LPA",
                    description: "Build modern, responsive, and high-performance user interfaces using React.js, Tailwind CSS, and Framer Motion.",
                    skills: JSON.stringify(["React.js", "JavaScript", "Tailwind CSS", "REST APIs", "Git"]),
                    status: "Active",
                },
                {
                    title: "Backend Developer",
                    department: "Engineering",
                    type: "Full Time",
                    location: "Noida",
                    experience: "2-4 Years",
                    salary: "₹6L - ₹10L LPA",
                    description: "Architect scalable backend services, RESTful APIs, and database models using Node.js, Express, and MongoDB/MySQL.",
                    skills: JSON.stringify(["Node.js", "Express", "MongoDB", "MySQL", "REST APIs"]),
                    status: "Active",
                },
                {
                    title: "UI/UX Designer",
                    department: "Design",
                    type: "Full Time",
                    location: "Noida",
                    experience: "1-3 Years",
                    salary: "₹4L - ₹7.5L LPA",
                    description: "Design clean, beautiful user interfaces, interactive wireframes, and high-fidelity prototypes in Figma.",
                    skills: JSON.stringify(["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping"]),
                    status: "Active",
                },
                {
                    title: "Digital Marketing Specialist",
                    department: "Marketing",
                    type: "Full Time",
                    location: "Noida",
                    experience: "1-3 Years",
                    salary: "₹3.5L - ₹6L LPA",
                    description: "Manage paid ads (Google & Meta), SMM campaigns, content strategy, and SEO optimization to drive targeted growth.",
                    skills: JSON.stringify(["Google Ads", "Meta Ads", "SEO", "Content Marketing", "Analytics"]),
                    status: "Active",
                },
            ]);
            console.log("Initial job openings seeded successfully.");
        }
    })
    .catch((err) => {
        console.error("Error syncing MySQL tables:", err.message);
    });

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/leads", require("./src/routes/lead.routes"));
app.use("/api/portfolio", require("./src/routes/portfolio.routes"));
app.use("/api/clients", require("./src/routes/client.routes"));
app.use("/api/testimonials", require("./src/routes/testimonial.routes"));
app.use("/api/settings", require("./src/routes/setting.routes"));
app.use("/api/upload", require("./src/routes/upload.routes"));
app.use("/api/jobs", require("./src/routes/job.routes"));

app.get("/", (req, res) => {
    res.send("Deytal MySQL API Server is running");
});

// Global Error Handler (must be defined after all other routes and middleware)
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;
app.listen(PORT, HOST, () => {
    console.log(`Server started and running on http://${HOST}:${PORT}`);
});