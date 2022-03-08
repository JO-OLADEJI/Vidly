const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

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
    lowercase: true,
    trim: true,
    unique: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },

  'password': {
    type: String,
    required: true,
    minlength: 10
  }
});

userSchema.methods.genAuthToken = function() {
  const token = jwt.sign({ '_id': this._id }, process.env.JWT_SECRET);
  return token;
}


const User = mongoose.model('users', userSchema);
module.exports = { userSchema, User };