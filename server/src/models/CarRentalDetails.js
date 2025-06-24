const mongoose = require('mongoose');

const carRentalDetailsSchema = new mongoose.Schema({
    car_rental_service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarRentalService',
        required: true
    },
    receipt_car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceiptRentalCar',
        required: true
    },
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    pickup_location: {
        type: String,
        required: true,
        maxlength: 50
    },
    drop_off_location: {
        type: String,
        required: true,
        maxlength: 50
    }
});

module.exports = mongoose.model('CarRentalDetails', carRentalDetailsSchema);
// This schema defines the details of a car rental transaction, including the service ID, receipt ID, payment ID,
// start and end dates and times, and pickup and drop-off locations. The fields are required and have appropriate data types and constraints.