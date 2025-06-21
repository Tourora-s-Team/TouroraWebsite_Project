const express = require("express");
const router = express.Router();
const addOnsController = require("../controllers/addOnsController");

// Lấy tất cả dịch vụ bổ sung
router.get("/", addOnsController.getAllAddOns);

// Thêm mới dịch vụ bổ sung
router.post("/", addOnsController.createAddOn);

// Xóa dịch vụ bổ sung theo id
router.delete("/:id", addOnsController.deleteAddOn);

module.exports = router;
