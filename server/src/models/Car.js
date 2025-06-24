const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const carSchema = new mongoose.Schema({
  car_name: {
    type: String,
    required: true,
    maxlength: 50
  },
  car_type: {
    type: String,
    required: true,
    maxlength: 20
  },
  transmission: {
    type: String,
    required: true,
    enum: ['manual', 'auto']
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  price_per_day: {
    type: Number,
    required: true,
    min: 0
  },
  car_des: {
    type: String,
    required: true
  },
  car_status: {
    type: String,
    required: true,
    maxlength: 50
  },
  car_note: {
    type: String
  },
  features: {
    type: [String], // Mảng các đặc điểm như "Tự động", "4 chỗ", "Máy lạnh"
    default: []
  },
  image: {
    type: String, // Đường dẫn ảnh
    default: ''
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
}, {
  timestamps: true
});

carSchema.plugin(AutoIncrement, { inc_field: 'car_id' });

module.exports = mongoose.model('Car', carSchema);
