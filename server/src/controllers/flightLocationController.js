const Flight = require("../models/Flight");

exports.getLocations = async (req, res) => {
  try {
    const departures = await Flight.distinct("departure.city");
    const arrivals = await Flight.distinct("arrival.city");
    res.json({ departures, arrivals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
