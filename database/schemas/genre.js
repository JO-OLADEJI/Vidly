const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
  value: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const Genre = mongoose.model('genres', genreSchema);


module.exports = Genre;