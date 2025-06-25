const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Flight = new Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    airline: {
      type: String,
      required: true,
    },
    departure: {
      city: { type: String, required: true },
      airport: { type: String, required: true },
      date: { type: Date, required: true },
    },
    arrival: {
      city: { type: String, required: true },
      airport: { type: String, required: true },
      date: { type: Date, required: true },
    },
    price: {
      economy: { type: Number, required: true },
      business: { type: Number, required: true },
    },
    seats: {
      economy: { type: Number, required: true },
      business: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", Flight);
