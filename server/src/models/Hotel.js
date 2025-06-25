const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    description: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    amenities: [String],
    images: [String],
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
