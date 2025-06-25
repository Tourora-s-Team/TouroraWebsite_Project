const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  contactInfo: {
    lastName: String,
    firstName: String,
    phone: String,
    email: String,
    countryCode: String,
  },
  paymentMethod: {
    type: String,
    enum: ["credit", "momo", "zalopay"],
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  paymentInfo: {
    creditCardNumber: String,
    cardHolder: String,
    expiryDate: String,
    cvv: String,
    phone: String, // momo/zalopay dùng trường này
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
