const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddOnsSchema = new Schema(
  {
    name: { type: String, required: true }, // Ví dụ: "Extra Baggage", "Meal"
    description: { type: String },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["baggage", "meal", "insurance", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddOns", AddOnsSchema);
