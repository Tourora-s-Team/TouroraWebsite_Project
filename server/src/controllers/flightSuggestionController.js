const Flight = require("../models/Flight");

const getFlightSuggestions = async (req, res) => {
  try {
    // Lấy ngẫu nhiên 6 chuyến bay để gợi ý
    const flights = await Flight.aggregate([{ $sample: { size: 6 } }]);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Controller lấy chi tiết chuyến bay theo id
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight)
      return res.status(404).json({ message: "Không tìm thấy chuyến bay" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getFlightSuggestions, getFlightById };
