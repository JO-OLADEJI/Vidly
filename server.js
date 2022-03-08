require('dotenv/config.js');
const express = require('express');
const app = express();
const debug = require('debug')('dev:start');
const pipeline = require('./utils/pipeline.js');
const connectDB = require('./utils/connectDB.js');
const PORT = process.env.PORT || 3000;


// connect to database: mongoDB
connectDB(process.env.DEV_DB_URI);


// load application pipeline
pipeline(app);


// listener for requests
app.listen(
  PORT, 
  () => debug(`Server running on http://localhost:${PORT} . . .`)
);