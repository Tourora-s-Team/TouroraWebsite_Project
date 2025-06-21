const Passenger = require("../models/Passenger");

const createPassenger = async (req, res) => {
  try {
    const passenger = new Passenger(req.body);
    const saved = await passenger.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Lỗi khi lưu thông tin hành khách:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi lưu thông tin hành khách" });
  }
};

module.exports = {
  createPassenger,
};
