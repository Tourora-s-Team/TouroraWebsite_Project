const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const User = require("../models/user");

// Route được bảo vệ bởi JWT
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
