const express = require("express");
const router = express.Router();
const flightLocationController = require("../controllers/flightLocationController");

router.get("/locations", flightLocationController.getLocations);

module.exports = router;
