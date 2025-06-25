const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TourSchema = new Schema(
  {
    IdTour: {
      type: String,
      required: true,
      trim: true, // tương đương RTRIM
      unique: true, // nếu muốn mã tour không trùng
    },
    title: {
      type: String,
      required: true, // TenTour
    },
    location: {
      type: String,
      required: true, // DiaDiem
    },
    date: {
      type: String, // Để kiểu String
      required: true,
    },
    rating: {
      type: Number,
      default: 0, // DanhGia
      min: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: true, // GiaTour
      min: 0,
    },
    groupSize: {
      type: Number,
      required: true, // SoNguoi
      min: 1,
    },
    image: {
      type: String, // AnhTour
      default: "",
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

module.exports = mongoose.model("Tour", TourSchema);
