/* Validation med Joi för användare*/
const Joi = require('joi');

// Validering av input med joi
const userValidation = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    password: Joi.string().min(4).max(30).required()
});

// export av objekten
module.exports = {
    userValidation
};
