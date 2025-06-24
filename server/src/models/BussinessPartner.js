const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const businessPartnerSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  services_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  company_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    maxlength: 30
  },
  states: {
    type: String,
    required: true,
    maxlength: 30
  },
  address: {
    type: String,
    required: true,
    maxlength: 100
  },
  logo_url: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0
  },
  review_count: {
    type: Number,
    default: 0
  },
  phone: {
    type: String,
    maxlength: 20
  },
  email: {
    type: String,
    maxlength: 100
  },
  airport_pickup: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

businessPartnerSchema.plugin(AutoIncrement, { inc_field: 'businessPartner_id' });

module.exports = mongoose.model('BusinessPartner', businessPartnerSchema);
