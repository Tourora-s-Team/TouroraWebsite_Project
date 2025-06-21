const mongoose = require('mongoose');

const bookingRoomDetailSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    numberOfNights: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: {
        type: Number,
        required: true
    },
    guestNames: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Active', 'Cancelled'],
        default: 'Active'
    }
});

module.exports = mongoose.model('BookingRoomDetail', bookingRoomDetailSchema);
