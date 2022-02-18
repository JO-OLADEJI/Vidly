const mongoose = require('mongoose');

const Movie = mongoose.model('movies', new mongoose.Schema({
  'title': {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    lowercase: true,
    trim: true
  },

  'genre': {
    type: Object,
    required: true
  },

  'numberInStock': {
    type: Number,
    min: 0,
    required: true
  },

  'dailyRentalFee': {
    type: Number,
    min: 0,
    required: true
  },

  'timestamp': {
    type: Date,
    default: Date.now
  }
}));


module.exports = Movie;