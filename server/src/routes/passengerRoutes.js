const express = require("express");
const router = express.Router();
const { createPassenger } = require("../controllers/passengerController");

router.post("/", createPassenger);

module.exports = router;
