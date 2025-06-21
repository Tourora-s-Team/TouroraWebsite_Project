const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Booking_Flight = new Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passengers: [
      {
        fullName: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        phone: String,
        email: String,
        seatType: {
          type: String,
          enum: ["economy", "business"],
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking_Flight", Booking_Flight);
