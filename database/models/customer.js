const mongoose = require('mongoose');

const Customer = mongoose.model('customers', new mongoose.Schema({
  'name': {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    lowercase: true,
    trim: true
  },
  'phone': {
    type: String,
    required: true,
    match: /^[0-9]/,
    minlength: 5,
    maxlength: 13,
    trim: true
  },
  'isGold': {
    type: Boolean,
    required: true,
    default: false
  },
  'timestamp': {
    type: Date,
    default: Date.now
  }
}));

module.exports = Customer;