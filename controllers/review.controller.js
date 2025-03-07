const mongoose = require('mongoose');
// Controller-fil för recensioner

// Modellen
const Review = require("../models/review.model");

// Hämta alla recensioner
exports.getAllReviews = async (request, h) => {

    try {
        // Hitta recensioner utifrån bookId
        const reviews = await Review.find().populate("userId", "username");

        if (reviews.length === 0) {
            return h.response("Inga recensioner hittades.").code(404);
        }
        return reviews;
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Hämta alla recensioner utifrån bok
exports.getReviewsByBook = async (request, h) => {

    const { bookId } = request.query;       // bookId

    try {
        // Hitta recensioner utifrån bookId
        const reviews = await Review.find({ bookId }).populate("userId", "username");

        if (reviews.length === 0) {
            return h.response([]).code(200);
        }

        return h.response(reviews).code(200);

    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Hämta alla recensioner för inloggad användare
exports.getReviewsByUser = async (request, h) => {

    if (!request.auth.isAuthenticated) {
        return h.response({ error: "Ej autentiserad" }).code(401);
    }

    try {
        const userId = request.auth.credentials.user._id;        // Hämtar userId från den inloggade användaren

        const reviews = await Review.find({ userId });

        if (!reviews.length) {
            return h.response("Inga recensioner hittades för denna användare.").code(404);
        }

        return reviews;
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};


// Hämta en recension utifrån ID
exports.getOneReview = async (request, h) => {
    try {
        const review = await Review.findById(request.params.id).populate("userId", "username");
        return review || h.response("Recensionen hittades inte").code(404);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Lägga till en ny recension
exports.addNewReview = async (request, h) => {
    try {
        const review = new Review(request.payload);
        return await review.save();
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Uppdatera en recension (bara egna recensioner)
exports.updateReview = async (request, h) => {
    try {
        const { id } = request.params;
        const updates = request.payload;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return h.response({ error: "Ogiltigt ObjectId-format" }).code(400);
        }

        const updatedReview = await Review.findOneAndUpdate(
            { _id: id },
            updates,
            { new: true, runValidators: true }
        );


        if (!updatedReview) return h.response("Recensionen hittades inte.").code(404);

        return h.response(updatedReview).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Ta bort en recension (bara egen recensioner)
exports.deleteReview = async (request, h) => {
    try {
        const { id } = request.params;

        const review = await Review.findOneAndDelete({ _id: id });

        if (!review) {
            return h.response("Recensionen hittades inte.").code(404);
        }

        return h.response({ message: "Recension borttagen" }).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};
