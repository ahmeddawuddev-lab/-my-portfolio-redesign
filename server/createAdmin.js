require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./db");

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error("Admin username or password is missing.");
  db.end();
  process.exit(1);
}

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash(password, 12);

    db.query(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      [username, passwordHash],
      (error, result) => {
        if (error) {
          console.error("Failed to create admin:", error.message);
        } else {
          console.log("Admin account created successfully!");
          console.log("Admin ID:", result.insertId);
        }

        db.end();
      },
    );
  } catch (error) {
    console.error("Password hashing failed:", error.message);
    db.end();
  }
}

createAdmin();
