const Hotel = require('../models/hotel');

// Lấy danh sách gợi ý khách sạn
exports.getSuggestions = async (req, res) => {
    try {
        // Có thể tuỳ chỉnh logic lấy suggestions, ví dụ lấy theo rating cao nhất
        const hotels = await Hotel.find().sort({ rating: -1 }).limit(16);
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy chi tiết 1 khách sạn theo id
exports.getHotelDetail = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
