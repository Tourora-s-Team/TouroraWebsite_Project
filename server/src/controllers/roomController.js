const Room = require('../models/room');

// Lấy danh sách phòng theo hotelId
exports.getRoomsByHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        // Lưu ý: trường trong DB là hotelId, không phải hotel
        const rooms = await Room.find({ hotelId: hotelId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
