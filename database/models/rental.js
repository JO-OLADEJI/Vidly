const mongoose = require('mongoose');

const rentalSchema = mongoose.Schema({
  'customer': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'customers'
  },

  'movie': {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'movies'
  },

  'rentDate': {
    type: Date,
    required: true,
    default: Date.now
  },

  'returnDate': {
    type: Date,
    required: false
  },

  'rentalFee': {
    type: Number,
    required: false,
    min: 0
  }
});

const Rental = mongoose.model('rentals', rentalSchema);
module.exports = Rental;