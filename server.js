require('dotenv/config.js');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('dev:start');
const homeRoute = require('./routes/home.js');
const genresRoute = require('./routes/genres.js');
const customerRoute = require('./routes/customers.js');
const errorRoute = require('./routes/error.js');
const connectDB = require('./database/connect.js');
const PORT = process.env.PORT || 3000;


// connect to database: mongoDB
connectDB(process.env.DEV_DB_URI);


// middlewares
app.use(express.json());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  debug('Routes logging enabled . . .');
  app.use(morgan('common'));
}


// routes
app.use('/', homeRoute);
app.use('/api/genres', genresRoute);
app.use('/api/customers', customerRoute);
app.use('/*', errorRoute);


// listener for requests
app.listen(
  PORT, 
  () => debug(`Server running on http://localhost:${PORT} . . .`)
);