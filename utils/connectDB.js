require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('dev:start');


const connectDB = () => {
  let connection_uri = null;

  if (process.env.NODE_ENV === 'production') {
    connection_uri = process.env.PROD_DB_URI;
  }
  else if (process.env.NODE_ENV === 'test') {
    connection_uri = process.env.TEST_DB_URI;
  }
  else { // assume it's in development mode
    connection_uri = process.env.DEV_DB_URI;
  }

  mongoose.connect(connection_uri)
    .then(() => debug('Connected to DB ✔'))
    .catch((err) => debug('Error connecting to DB ❌'));
}


module.exports = connectDB;