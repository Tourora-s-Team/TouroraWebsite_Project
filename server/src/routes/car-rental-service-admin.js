const express = require("express");
const router = express.Router();
const {
  createCarRentalService,
  getCarRentalServices,
  getCarRentalServiceById,
  updateCarRentalService,
  deleteCarRentalService,
  syncAllCarStatus,
  syncCarStatusById,
  getCarsWithRentalStatus
} = require("../controllers/car-rental-service-controller");
const authenticateToken = require("../middlewares/authenticate-token");

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// Car Rental Service CRUD
router.post('/', createCarRentalService);                    // Tạo rental service mới
router.get('/', getCarRentalServices);                       // Lấy tất cả rental services
router.get('/:id', getCarRentalServiceById);                 // Lấy rental service theo ID
router.put('/:id', updateCarRentalService);                  // Cập nhật rental service
router.delete('/:id', deleteCarRentalService);               // Xóa rental service

// Sync routes
router.post('/sync/all', syncAllCarStatus);                  // Đồng bộ tất cả car status
router.post('/sync/car/:carId', syncCarStatusById);          // Đồng bộ car status theo ID

// Utility routes
router.get('/cars/with-rental-status', getCarsWithRentalStatus); // Lấy xe với thông tin rental

module.exports = router;
