const mongoose = require('mongoose');
const debug = require('debug')('dev:start');

const connectDB = (dbUri) => {
  mongoose.connect(
    dbUri,
    {  },
  )
  .then(() => debug('Connected to DB ✔'))
  .catch((err) => debug('Error connecting to DB ❌'))
}


module.exports = connectDB;