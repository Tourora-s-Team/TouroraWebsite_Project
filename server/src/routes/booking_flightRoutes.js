const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking_flightController");

router.post("/", createBooking);
module.exports = router;
