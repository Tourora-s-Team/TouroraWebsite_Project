const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticate-token');
const {
  getAllBusinessPartners,
  getCarRentalPartners,
  getBusinessPartnerById
} = require('../controllers/business-partner-controller');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/admin/business-partners - Lấy tất cả business partners
router.get('/', getAllBusinessPartners);

// GET /api/admin/business-partners/car-rental - Lấy business partners cho car rental
router.get('/car-rental', getCarRentalPartners);

// GET /api/admin/business-partners/:id - Lấy business partner theo ID
router.get('/:id', getBusinessPartnerById);

module.exports = router;
