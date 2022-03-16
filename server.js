require('dotenv/config.js');
const express = require('express');
const app = express();
const debug = require('debug')('dev:start');
const pipeline = require('./utils/pipeline.js');
const connectDB = require('./utils/connectDB.js');
const PORT = process.env.PORT || 3000;


// connect to database: mongoDB
connectDB();


// load application pipeline
pipeline(app);


// listener for requests
const server = app.listen(
  PORT, 
  () => debug(`${process.env.NODE_ENV} server running on http://localhost:${PORT} . . .`)
);

module.exports = server;