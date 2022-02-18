const Joi = require('joi');
// init Joi objectId package

/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateGenre = (reqBody) => {
  const schema = Joi.object({
    'value': Joi.string().min(3).max(255).required()
  });

  return schema.validate(reqBody);
}


/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateCustomer = (reqBody) => {
  const schema = Joi.object({
    'name': Joi.string().min(3).max(255).required(),
    'phone': Joi.string().min(5).max(13).required(),
    'isGold': Joi.bool().default(false)
  });

  return schema.validate(reqBody);
}


/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateMovie = (reqBody) => {
  const schema = Joi.object({
    'title': Joi.string().min(3).max(255).required(),
    'genreId': Joi.string().length(24).required(),
    'numberInStock': Joi.number().min(0).required(),
    'dailyRentalFee': Joi.number().min(0).required()
  });

  return schema.validate(reqBody);
}


/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateRental = (reqBody) => {
  const schema = Joi.object({
    'customerId': Joi.string().length(24).required(),
    'movieId': Joi.string().length(24).required()
  });

  return schema.validate(reqBody);
}


module.exports = { 
  validateGenre,
  validateCustomer,
  validateMovie,
  validateRental
};