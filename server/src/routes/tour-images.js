const express = require("express");
const router = express.Router();

const images = [
  "https://media.travel.com.vn/TourFiles/8769/Cho Da Lat.jpg",
  "https://media.travel.com.vn/TourFiles/8769/shutterstock_1561920592 (NhaThoDomain).jpg",
  "https://media.travel.com.vn/TourFiles/10764/TOUR DAO (4).jpg",
  "https://media.travel.com.vn/TourFiles/3464/quang truong lam vien.jpg",
  "https://media.travel.com.vn/TourFiles/3464/cao nguyen hoa (6).jpg",
  "https://media.travel.com.vn/Tour/tfd__1_9902_shutterstock1730991943-hon-tam.webp",
  // Thêm các link ảnh khác nếu muốn
];

router.get("/", (req, res) => {
  res.json(images);
});

module.exports = router;
