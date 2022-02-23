const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

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
    'genreId': Joi.objectId(),
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
    'customerId': Joi.objectId(),
    'movieId': Joi.objectId()
  });

  return schema.validate(reqBody);
}


/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateUser = (reqBody) => {
  const schema = Joi.object({
    'name': Joi.string().required().trim().min(5).max(255).lowercase(),
    'email': Joi.string().required().trim().email(),
    'password': Joi.string().required().min(6).trim()
  });

  return schema.validate(reqBody);
}


/**
 * @param {Object} reqBody - a JSON containing the body of the request
 * @returns {Object} - a {value, error} object
 */
const validateLoginCredentials = (reqBody) => {
  const schema = Joi.object({
    'email': Joi.string().email().required(),
    'password': Joi.string().required()
  });
  return schema.validate(reqBody);
}


module.exports = { 
  validateGenre,
  validateCustomer,
  validateMovie,
  validateRental,
  validateUser,
  validateLoginCredentials
};