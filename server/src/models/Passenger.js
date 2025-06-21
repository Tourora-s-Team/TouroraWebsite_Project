const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PassengerSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String },
    passportNumber: { type: String },
    passportExpiry: { type: Date },
    type: { type: String, enum: ["adult", "child", "infant"], required: true },
    seat: { type: String },
    specialRequest: { type: String },
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

module.exports = mongoose.model("Passenger", PassengerSchema);
