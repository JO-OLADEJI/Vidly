const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = mongoose.Schema({
  'name': {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },

  'email': {
    type: String,
    required: true,
    trim: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },

  'password': {
    type: String,
    required: true,
    minlength: 10
  }
});

userSchema.methods.getAuthToken = function() {
  const token = jwt.sign({ '_id': this._id }, process.env.JWT_SECRET);
  return token;
}


const User = mongoose.model('users', userSchema);
module.exports = User;