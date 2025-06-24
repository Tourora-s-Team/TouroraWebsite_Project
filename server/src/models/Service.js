const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  service_id: {
    type: String,
    required: true,
    unique: true,
  },
  serviceName: {
    type: String,
    required: true,
    maxlength: 100
  }
});

module.exports = mongoose.model('Service', serviceSchema);
