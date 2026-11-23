const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require("../middleware/authMiddleware");

function validateProject(title, description) {
  if (typeof title !== "string" || typeof description !== "string") {
    return "Title and description must be text.";
  }

  if (!title.trim() || !description.trim()) {
    return "Title and description are required.";
  }

  if (title.trim().length > 150) {
    return "Project title must not exceed 150 characters.";
  }

  if (description.trim().length > 65535) {
    return "Project description is too long.";
  }

  return null;
}

function validateProjectId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

function validateProjectUrls(github_url, live_url) {
  const urls = [github_url, live_url];

  for (const url of urls) {
    if (url === undefined || url === null || url === "") {
      continue;
    }

    if (typeof url !== "string" || url.length > 255) {
      return "Project URLs must be text and must not exceed 255 characters.";
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return "Project URLs must use HTTP or HTTPS.";
      }
    } catch {
      return "Please provide valid project URLs.";
    }
  }

  return null;
}

function isValidImageFile(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(12);

  try {
    const bytesRead = fs.readSync(fd, buffer, 0, 12, 0);

    const isJpeg =
      bytesRead >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;

    const isPng =
      bytesRead >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

    const isWebp =
      bytesRead >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";

    return isJpeg || isPng || isWebp;
  } finally {
    fs.closeSync(fd);
  }
}

// Configure image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allow image files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WebP images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET all projects
router.get("/", (req, res) => {
  const sql = "SELECT * FROM projects ORDER BY id DESC";

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to retrieve projects",
      });
    }

    res.status(200).json(results);
  });
});

// ADD a project
router.post("/", verifyToken, upload.single("image"), (req, res) => {
  if (req.file && !isValidImageFile(req.file.path)) {
    fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: "Uploaded file is not a valid image.",
    });
  }
  const { title, description, technologies, github_url, live_url } = req.body;
  const urlValidationError = validateProjectUrls(github_url, live_url);

  if (urlValidationError) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: urlValidationError,
    });
  }

  const validationError = validateProject(title, description);

  if (validationError) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: validationError,
    });
  }

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO projects
    (title, description, image, technologies, github_url, live_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title.trim(),
      description.trim(),
      image,
      technologies || "",
      github_url || "",
      live_url || "",
    ],
    (error, result) => {
      if (error) {
        if (req.file) fs.unlinkSync(req.file.path);

        return res.status(500).json({
          message: "Failed to add project",
        });
      }

      res.status(201).json({
        message: "Project added successfully",
        id: result.insertId,
      });
    },
  );
});

// UPDATE a project
router.put("/:id", verifyToken, upload.single("image"), (req, res) => {
  if (req.file && !isValidImageFile(req.file.path)) {
    fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: "Uploaded file is not a valid image.",
    });
  }
  const { id } = req.params;
  if (!validateProjectId(id)) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: "Invalid project ID.",
    });
  }
  const { title, description, technologies, github_url, live_url } = req.body;
  const urlValidationError = validateProjectUrls(github_url, live_url);

  if (urlValidationError) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: urlValidationError,
    });
  }

  const validationError = validateProject(title, description);

  if (validationError) {
    if (req.file) fs.unlinkSync(req.file.path);

    return res.status(400).json({
      message: validationError,
    });
  }

  db.query(
    "SELECT image FROM projects WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({
          message: "Failed to find project",
        });
      }

      if (results.length === 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const oldImage = results[0].image;
      const newImage = req.file ? req.file.filename : oldImage;

      const sql = `
        UPDATE projects
        SET title = ?, description = ?, image = ?,
            technologies = ?, github_url = ?, live_url = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          title.trim(),
          description.trim(),
          newImage,
          technologies || "",
          github_url || "",
          live_url || "",
          id,
        ],
        (updateError, result) => {
          if (updateError) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(500).json({
              message: "Failed to update project",
            });
          }

          if (req.file && oldImage) {
            const oldPath = path.join(__dirname, "../uploads", oldImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }

          res.status(200).json({
            message: "Project updated successfully",
          });
        },
      );
    },
  );
});

// DELETE a project
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  if (!validateProjectId(id)) {
    return res.status(400).json({
      message: "Invalid project ID.",
    });
  }

  db.query(
    "SELECT image FROM projects WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to find project",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const image = results[0].image;

      db.query("DELETE FROM projects WHERE id = ?", [id], (deleteError) => {
        if (deleteError) {
          return res.status(500).json({
            message: "Failed to delete project",
          });
        }

        if (image) {
          const imagePath = path.join(__dirname, "../uploads", image);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        res.status(200).json({
          message: "Project deleted successfully",
        });
      });
    },
  );
});

module.exports = router;
