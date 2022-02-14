const Joi = require('joi');

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
    'genreId': Joi.string().min(3).max(255).required(),
    'numberInStock': Joi.number().min(0).required(),
    'dailyRentalRate': Joi.number().min(0).required()
  });
  return schema.validate(reqBody);
}


module.exports = { 
  validateGenre,
  validateCustomer,
  validateMovie
};