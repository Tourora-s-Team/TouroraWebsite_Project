const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // Lấy dữ liệu tour từ client gửi lên (nếu cần)
  const tour = req.body;
  // Có thể xử lý lưu vào DB ở đây nếu muốn

  // Trả về thông báo cho client
  res.send(`Đặt tour "${tour.name}" thành công!`);
});

module.exports = router;
