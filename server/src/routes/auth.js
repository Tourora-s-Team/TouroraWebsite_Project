const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/regist", registerUser);
router.post("/login", loginUser);

module.exports = router;
