const Joi = require('joi');

const vehicleSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().integer().min(1900).required(),
  price: Joi.number().required(),
});

module.exports = { vehicleSchema };
