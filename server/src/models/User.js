const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    index: ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: String,
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: Date,
    paymentInfo: {
        cardNumber: { type: String, required: true },
        cardHolder: { type: String },
        expiryDate: { type: Date },
        bankName: { type: String },
        paymentType: { type: String, enum: ['credit', 'debit', 'paypal', 'visa'] },
    },
    bookingTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookingTour' }], // Thêm dòng này
    createAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('User', User)


