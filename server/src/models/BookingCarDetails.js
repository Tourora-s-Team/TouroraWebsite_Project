const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Schema phụ cho địa điểm
const LocationSchema = new Schema({
    id: String,
    name: String,
    address: String,
    type: String, // 'airport', 'hotel', 'office', etc.
    available24h: Boolean,
    pickupFee: Number,
    coordinates: {
        lat: Number,
        lng: Number
    },
    instructions: String
}, { _id: false });

const BookingCarDetails = new Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    // Car Information - Only store reference ID
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },

    // Supplier Information - Only store reference ID
    businessPartner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessPartner',
        required: true
    },

    // CarRentalService reference for status management
    carRentalService_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarRentalService',
        required: true
    },

    // Rental Details
    rental: {
        startDate: { type: Date, required: true },
        startTime: String,
        endDate: { type: Date, required: true },
        endTime: String,
        mode: {
            type: String,
            enum: ['driver', 'self'],
            required: true
        },
        location: String,
        totalDays: Number
    },

    // Pickup and Dropoff Locations
    pickupLocation: LocationSchema,
    dropoffLocation: LocationSchema,

    // Customer Information
    customerInfo: {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        dateOfBirth: Date,
        nationality: String,

        // Driver License Information
        driverLicense: String,
        licenseIssueDate: Date,
        licenseExpiryDate: Date,

        // Emergency Contact
        emergencyContact: String,
        emergencyPhone: String,

        // Special Requests
        specialRequests: String
    },

    // Additional Services/Extras
    extras: [{
        id: String,
        name: String,
        description: String,
        price: Number,
        type: String // 'insurance', 'equipment', 'service', 'fuel'
    }],

    // Pricing Breakdown
    pricing: {
        basePrice: { type: Number, required: true },
        extraCharges: { type: Number, default: 0 },
        taxes: { type: Number, default: 0 },
        total: { type: Number, required: true },
        days: Number,
        currency: { type: String, default: 'VND' }
    },

    // Booking Status and Management
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in_progress'],
        default: 'pending'
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
        default: 'pending'
    },

    // Payment Information
    paymentDetails: {
        method: String, // 'credit_card', 'bank_transfer', 'cash', 'online'
        transactionId: String,
        paidAmount: Number,
        paidAt: Date,
        refundAmount: Number,
        refundedAt: Date
    },

    // User Reference (if logged in)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    // Confirmation and Communication
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },

    // Notes and Internal Information
    notes: {
        customer: String,
        internal: String,
        supplier: String
    },

    // Cancellation Information
    cancellation: {
        cancelledAt: Date,
        cancelledBy: String, // 'customer', 'supplier', 'admin'
        reason: String,
        refundAmount: Number
    },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Booking expiry (for pending bookings)
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        }
    }
});

// Middleware to update the updatedAt field before saving
BookingCarDetails.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Index for efficient queries
BookingCarDetails.index({ status: 1 });
BookingCarDetails.index({ 'customerInfo.email': 1 });
BookingCarDetails.index({ 'rental.startDate': 1 });
BookingCarDetails.index({ userId: 1 });
BookingCarDetails.index({ createdAt: -1 });

// Instance methods
BookingCarDetails.methods.calculateTotalPrice = function () {
    const basePrice = this.pricing.basePrice || 0;
    const extraCharges = this.pricing.extraCharges || 0;
    const taxes = this.pricing.taxes || 0;
    return basePrice + extraCharges + taxes;
};

BookingCarDetails.methods.isExpired = function () {
    return this.expiresAt < new Date();
};

BookingCarDetails.methods.canBeCancelled = function () {
    const now = new Date();
    const startDate = new Date(this.rental.startDate);
    const hoursDiff = (startDate - now) / (1000 * 60 * 60);

    // Can be cancelled if more than 24 hours before start date
    return hoursDiff > 24 && this.status !== 'cancelled' && this.status !== 'completed';
};

module.exports = mongoose.model('BookingCarDetails', BookingCarDetails);
