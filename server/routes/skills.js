const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/authMiddleware");

function validateSkill(name, category) {
  if (typeof name !== "string" || typeof category !== "string") {
    return "Skill name and category must be text.";
  }

  if (!name.trim() || !category.trim()) {
    return "Skill name and category are required.";
  }

  if (name.trim().length > 100 || category.trim().length > 100) {
    return "Skill name and category must not exceed 100 characters.";
  }

  return null;
}
function validateId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

// GET all skills
router.get("/", (req, res) => {
  const sql = "SELECT * FROM skills ORDER BY id DESC";

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Failed to retrieve skills" });
    }

    res.status(200).json(results);
  });
});

// ADD a skill
router.post("/", verifyToken, (req, res) => {
  const { name, category } = req.body;

  const validationError = validateSkill(name, category);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const sql = "INSERT INTO skills (name, category) VALUES (?, ?)";

  db.query(sql, [name.trim(), category.trim()], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Failed to add skill" });
    }

    res.status(201).json({
      message: "Skill added successfully",
      id: result.insertId,
      name: name.trim(),
      category: category.trim(),
    });
  });
});

// UPDATE a skill
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  if (!validateId(id)) {
    return res.status(400).json({
      message: "Invalid skill ID.",
    });
  }

  const validationError = validateSkill(name, category);

  if (validationError) {
    return res.status(400).json({
      message: validationError,
    });
  }

  const sql = "UPDATE skills SET name = ?, category = ? WHERE id = ?";

  db.query(sql, [name.trim(), category.trim(), id], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Failed to update skill" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill updated successfully" });
  });
});

// DELETE a skill
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({
      message: "Invalid skill ID.",
    });
  }

  const sql = "DELETE FROM skills WHERE id = ?";

  db.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Failed to delete skill" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill deleted successfully" });
  });
});

module.exports = router;
