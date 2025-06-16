const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Account = new Schema({
  index: ObjectId,
  username:
  {
    type: String,
    required: true, // Bắt buộc phải có
    unique: true // Phải là duy nhất
  },
  password:
  {
    type: String,
    required: true,
  },
  role:
  {
    type: String,
    enum: ['admin', 'user', 'partner'],
    default: 'user',
  },
  createAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Account', Account)


