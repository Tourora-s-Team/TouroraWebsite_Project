const express = require("express");
const router = express.Router();
const { 
  getLocations, 
  getLocationById
} = require("../controllers/location-controller");

// GET endpoint để lấy danh sách các địa điểm (có thể thêm query param searchQuery)
router.get("/", getLocations);

// GET endpoint để lấy thông tin chi tiết của một địa điểm dựa trên ID
router.get("/:id", getLocationById);

module.exports = router;
