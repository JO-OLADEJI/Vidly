const Joi = require('joi');

const validateGenre = (genre) => {
  const schema = Joi.string().min(3).max(20).required();
  return schema.validate(genre);
}


module.exports = { validateGenre };