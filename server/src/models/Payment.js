const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash']
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        unique: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    currency: {
        type: String,
        default: 'USD'
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
