const Joi = require('joi');

const validateGenre = (reqBody) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).max(20).required()
  });
  return schema.validate(reqBody);
}


module.exports = { validateGenre };