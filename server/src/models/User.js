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
    numberPhone: { type: String, required: true }, // Changed from phoneNumber to match frontend
    address: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    dateOfBirth: Date,
    nationality: { 
        type: String, 
        default: 'Vietnam' 
    },
    
    // Driver License Information for car rental
    driverLicense: {
        number: { type: String },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        issuingCountry: { type: String, default: 'Vietnam' },
        class: { type: String } // A1, A2, B1, B2, C, D, E, F
    },
    
    // Emergency Contact Information
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relationship: { type: String } // spouse, parent, sibling, friend, etc.
    },
    
    // Payment Information
    paymentInfo: {
        cardNumber: { type: String },
        cardHolder: { type: String },
        expiryDate: { type: Date },
        bankName: { type: String },
        paymentType: { type: String, enum: ['credit', 'debit', 'paypal', 'visa'] },
    },
    
    // User preferences for car rental
    preferences: {
        preferredCarType: { type: String }, // sedan, suv, hatchback, etc.
        smokingAllowed: { type: Boolean, default: false },
        petFriendly: { type: Boolean, default: false },
        language: { type: String, default: 'vi' }
    },
    
    // Booking history reference
    bookingHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarRentalDetails'
    }],    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before saving
User.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Instance method to get driver license info for car rental
User.methods.getDriverLicenseInfo = function() {
    return {
        number: this.driverLicense?.number || '',
        issueDate: this.driverLicense?.issueDate || '',
        expiryDate: this.driverLicense?.expiryDate || '',
        issuingCountry: this.driverLicense?.issuingCountry || 'Vietnam',
        class: this.driverLicense?.class || ''
    };
};

// Instance method to get emergency contact info
User.methods.getEmergencyContactInfo = function() {
    return {
        name: this.emergencyContact?.name || '',
        phone: this.emergencyContact?.phone || '',
        relationship: this.emergencyContact?.relationship || ''
    };
};

// Instance method to check if user has valid driver license
User.methods.hasValidDriverLicense = function() {
    if (!this.driverLicense?.number || !this.driverLicense?.expiryDate) {
        return false;
    }
    
    const currentDate = new Date();
    const expiryDate = new Date(this.driverLicense.expiryDate);
    
    return expiryDate > currentDate;
};


module.exports = mongoose.model('User', User)


