const express = require("express");
const router = express.Router();
const {
  getFlightSuggestions,
  getFlightById,
} = require("../controllers/FlightSuggestionController");

// Lấy danh sách gợi ý chuyến bay
router.get("/suggestions", getFlightSuggestions);

// Lấy chi tiết chuyến bay theo id
router.get("/:id", getFlightById);

module.exports = router;
