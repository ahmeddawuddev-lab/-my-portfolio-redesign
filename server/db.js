const mysql = require("mysql2");
require("dotenv").config();

const isCloud = process.env.DB_SSL === "true";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  ssl: isCloud ? { minVersion: "TLSv1.2" } : undefined,
});

db.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
    return;
  }

  console.log("MySQL database connected successfully!");
});

module.exports = db;
