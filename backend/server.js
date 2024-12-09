const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // Serve uploaded files

// Cấu hình MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Kết nối tới MySQL thành công!");
});

// Cấu hình Multer (lưu file trong thư mục uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// API: Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const sql = "INSERT INTO files (name, path) VALUES (?, ?)";
    db.query(sql, [file.originalname, file.path], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ message: "Database error" });
      }
      res.send({ message: "File uploaded successfully", file });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send({ message: "Server error" });
  }
});


// API: Lấy danh sách file
app.get("/files", (req, res) => {
  const sql = "SELECT id, name, path, uploaded_at FROM files";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


// API: Tải file
app.get("/download/:id", (req, res) => {
  const sql = "SELECT * FROM files WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send({ message: "File not found" });
    }
    const file = results[0];
    res.download(file.path, file.name);
  });
});

// Khởi động server
app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});
