const express = require("express");
const router = express.Router();

// Mock database
let rentals = [];

// API endpoint cho car rental
router.post("/rentals", (req, res) => {
  try {
    const newRental = req.body;
    rentals.push(newRental); // Trong thực tế, bạn sẽ lưu vào database

    res.status(201).json({
      success: true,
      message: "Đã gửi yêu cầu thành công!",
      data: newRental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi gửi yêu cầu",
    });
  }
});

// Lấy danh sách rentals (test)
router.get("/rentals", (req, res) => {
  res.json(rentals);
});
module.exports = router;
