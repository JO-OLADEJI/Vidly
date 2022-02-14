const mongoose = require('mongoose');

const Genre = mongoose.model('genres', new mongoose.Schema({
  value: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    lowercase: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}));

module.exports = Genre;