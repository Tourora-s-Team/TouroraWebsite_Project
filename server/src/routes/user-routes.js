const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticate-token");
const { getUserProfile, updateUserProfile } = require("../controllers/auth-controller");

// Route được bảo vệ bởi JWT
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

module.exports = router;
