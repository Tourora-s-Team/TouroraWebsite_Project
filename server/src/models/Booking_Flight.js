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
    passengerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Passenger",
        required: true,
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
    addons: [
      {
        addon: { type: Schema.Types.ObjectId, ref: "AddOns" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking_Flight", Booking_Flight);
