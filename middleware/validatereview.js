/* Validation med Joi för recensioner */
const Joi = require('joi');

// Validering av input för recensioner
const reviewValidation = Joi.object({
    bookId: Joi.string().required(), 
    userId: Joi.string().required(),
    reviewText: Joi.string().min(1).max(500).required(), 
    rating: Joi.number().integer().min(1).max(5).required(), 
});

// Export av objektet
module.exports = {
    reviewValidation
};