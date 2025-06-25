const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Lỗi khi lưu thanh toán:", error);
    res.status(500).json({ message: "Lỗi server khi lưu thanh toán" });
  }
};

module.exports = {
  createPayment,
};
