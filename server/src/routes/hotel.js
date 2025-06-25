const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// Route lấy suggestions khách sạn
router.get('/suggestions', hotelController.getSuggestions);
// Route lấy chi tiết khách sạn
router.get('/:id', hotelController.getHotelDetail);

module.exports = router;
