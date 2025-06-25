const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// API endpoint cho booking khách sạn
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', async (req, res) => {
  try {
    const BookingHotel = require('../models/booking-hotels');
    const Customer = require('../models/customer');
    const bookings = await BookingHotel.find().populate('userId').populate('customerId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;