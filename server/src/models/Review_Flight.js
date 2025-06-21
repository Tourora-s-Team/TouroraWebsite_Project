const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewFlight = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flightId: {
      type: Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxLength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review_Flight", ReviewFlight);
