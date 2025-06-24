const User = require('../models/User');

async function getUserProfile(req, res) {
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
}

module.exports = {
  getUserProfile,
};