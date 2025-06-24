const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const receiptRentalCarSchema = new mongoose.Schema({
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
}, {
  timestamps: true
});

receiptRentalCarSchema.plugin(AutoIncrement, { inc_field: 'receipt_id' });

module.exports = mongoose.model('ReceiptRentalCar', receiptRentalCarSchema);

