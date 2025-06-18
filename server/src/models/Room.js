const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Twin', 'Suite', 'Deluxe']
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerNight: {
        type: Number,
        required: true,
        min: 0
    },
    amenities: [String],
    images: [String],
    status: {
        type: String,
        enum: ['Available', 'Occupied', 'Maintenance'],
        default: 'Available'
    },
    description: String,
    area: Number, // in square meters/feet
    bedType: String,
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Room', roomSchema);
