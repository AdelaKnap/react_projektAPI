/* Schema och modell för recenssioner */

const Mongoose = require('mongoose');

// Schema för en review
const reviewSchema = Mongoose.Schema(
    {
        bookId: {
            type: String,
            required: true
        },
        bookTitle: {
            type: String,
            required: true
        },
        userId: {
            type: Mongoose.Schema.Types.ObjectId, // Koppla till användare utifrån id på respektive användare
            ref: 'User',
            required: true
        },
        reviewText: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        }
    }
);

// Skapa modellen utifrån schemat
const Review = Mongoose.model("Review", reviewSchema);

// Exportera modellen för att kunna nås från andra filer
module.exports = Review;