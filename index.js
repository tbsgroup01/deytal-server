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
const TeamMember = require("./src/models/TeamMember");
const ProjectPortfolio = require("./src/models/ProjectPortfolio");

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

        // Auto-seed initial project portfolio items if empty
        const projCount = await ProjectPortfolio.count();
        if (projCount === 0) {
            await ProjectPortfolio.bulkCreate([
                { title: "Interglobal Training & Development Website", image: "", order: 1 },
                { title: "Stryxx Wear E-Commerce Website", image: "", order: 2 },
                { title: "Lab88 Streetwear Fashion Website", image: "", order: 3 },
                { title: "BW Packaging Solutions Platform", image: "", order: 4 },
                { title: "Gulmarg Jewellery E-Commerce Website", image: "", order: 5 },
                { title: "NewsTrendify Dynamic News Portal", image: "", order: 6 },
                { title: "Roots Tale Cultural E-Commerce Store", image: "", order: 7 },
                { title: "Railway Management System", image: "", order: 8 },
            ]);
            console.log("Initial Project Portfolio mockups seeded successfully.");
        }

        // Auto-seed initial team members if TeamMember table is empty
        const teamCount = await TeamMember.count();
        if (teamCount === 0) {
            await TeamMember.bulkCreate([
                { name: "Anand Kumar", title: "Laravel Developer", image: "", order: 1 },
                { name: "Ajay Kumar Thakur", title: "CEO", image: "", order: 2 },
                { name: "Baiju Yadav", title: "Software Developer", image: "", order: 3 },
                { name: "Kush Singh", title: "Frontend Developer", image: "", order: 4 },
                { name: "Vikash Yadav", title: "WordPress Developer", image: "", order: 5 },
                { name: "Akansha", title: "Sales Head", image: "", order: 6 },
                { name: "Mahaveer Singh", title: "Full Stack Developer", image: "", order: 7 },
                { name: "Anand Kumar", title: "Full Stack Developer", image: "", order: 8 },
            ]);
            console.log("Initial team members seeded successfully.");
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
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
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
app.use("/api/team", require("./src/routes/team.routes"));
app.use("/api/project-portfolio", require("./src/routes/projectPortfolio.routes"));

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