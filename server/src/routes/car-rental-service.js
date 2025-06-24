const express = require("express");
const router = express.Router();
const carController = require("../controllers/car-rental-controller");

// Thêm route debug để kiểm tra request đến
router.post('/debug-search', (req, res) => {
  try {
    console.log('DEBUG - Car Rental Search Request:');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', req.query);
    
    // Kiểm tra các yếu tố quan trọng
    const { filters } = req.body;
    const validationResults = {
      hasFilters: !!filters,
      filtersIsObject: typeof filters === 'object' && filters !== null,
      hasLocation: filters && typeof filters.location !== 'undefined',
      locationIsString: filters && typeof filters.location === 'string',
      locationNonEmpty: filters && typeof filters.location === 'string' && filters.location.trim() !== ''
    };
    
    return res.status(200).json({
      success: true,
      message: 'Debug information',
      requestBody: req.body,
      validationResults,
      recommendedFix: !validationResults.locationNonEmpty 
        ? "Ensure filters.location is a non-empty string" 
        : "Request appears valid"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message
    });
  }
});

router.post('/search', carController.searchCar);
router.post('/book', carController.bookCar);
router.get('/suppliers/:carId', carController.getSuppliers);

// Car availability check
router.get('/check-availability', carController.checkCarAvailability);

// Booking management routes
router.get('/bookings/stats', carController.getBookingStats);
router.get('/bookings', carController.getAllBookings);
router.get('/booking/:bookingId', carController.getBookingById);
router.put('/booking/:bookingId/status', carController.updateBookingStatus);
router.post('/booking/:bookingId/cancel', carController.cancelBooking);

// Car management routes
router.get('/:id', carController.getCarById);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);
router.get('/', carController.getCars);

module.exports = router;
