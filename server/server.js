const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./db");
require("dotenv").config();
const skillsRoutes = require("./routes/skills");
const projectsRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");
const { rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

const app = express();
app.use(helmet());

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Portfolio Admin API is running!");
});

// Database test route
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 AS result", (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Database query failed",
      });
    }

    res.json({
      message: "Database query successful!",
      data: results,
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
