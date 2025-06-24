const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyToken } = require("../controllers/auth-controller");
const authenticateToken = require("../middlewares/authenticate-token");

router.post("/regist", registerUser);
router.post("/login", loginUser);
router.get("/verify", authenticateToken, verifyToken);

module.exports = router;
