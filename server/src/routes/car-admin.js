const express = require("express");
const router = express.Router();
const carController = require("../controllers/car-rental-controller");
const authenticateToken = require("../middlewares/authenticate-token");

// Tất cả routes admin đều yêu cầu authentication
router.use(authenticateToken);

// Admin car management routes
router.post('/', carController.createCar);           // Tạo xe mới
router.get('/', carController.getCars);             // Lấy danh sách tất cả xe
router.get('/:id', carController.getCarById);       // Lấy thông tin xe theo ID
router.put('/:id', carController.updateCar);        // Cập nhật thông tin xe
router.delete('/:id', carController.deleteCar);     // Xóa xe

// Admin booking management routes
router.get('/bookings/all', carController.getAllBookings);
router.get('/bookings/stats', carController.getBookingStats);
router.put('/bookings/:bookingId/status', carController.updateBookingStatus);

module.exports = router;
