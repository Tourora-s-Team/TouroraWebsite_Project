const express = require("express");
// Thư viện Express để tạo router

const router = express.Router();

const Tour = require("../models/Tour"); // Đường dẫn tới model Tour

// Lấy danh sách tour từ MongoDB
router.get("/all-tours", async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.json(tours);
  } catch (err) {
    console.error("Lỗi lấy danh sách tour:", err);
    res.status(500).send("Lỗi lấy danh sách tour!");
  }
});

module.exports = router;
// Export router để sử dụng ở file index.js
