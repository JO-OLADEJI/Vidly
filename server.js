require('dotenv/config.js');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('dev:start');

const homeRouter = require('./routes/home.js');
const genresRouter = require('./routes/genres.js');
const customerRouter = require('./routes/customers.js');
const movieRouter = require('./routes/movies.js');
const errorRouter = require('./routes/error.js');
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
app.use('/', homeRouter);
app.use('/api/genres', genresRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', movieRouter);
app.use('/*', errorRouter);


// listener for requests
app.listen(
  PORT, 
  () => debug(`Server running on http://localhost:${PORT} . . .`)
);