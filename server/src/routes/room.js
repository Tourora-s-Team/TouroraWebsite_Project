const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Lấy danh sách phòng theo hotelId
router.get('/hotel/:id', roomController.getRoomsByHotel);

module.exports = router;
