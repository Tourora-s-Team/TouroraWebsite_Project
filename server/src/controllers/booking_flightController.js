const Booking = require("../models/Booking_Flight");

const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    res.status(500).json({ message: "Lỗi server khi tạo booking" });
  }
};

module.exports = { createBooking };
