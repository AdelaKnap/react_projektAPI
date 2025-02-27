// Controller-fil för recensioner

// Modellen
const Review = require("../models/review.model");

// Hämta alla recensioner för en specifik bok
exports.getAllReviews = async (request, h) => {

    const { bookId } = request.query;       // bookId

    if (!bookId) {
        return h.response({ error: "bookId krävs" }).code(400);
    }

    try {
        const reviews = await Review.find({ bookId }).populate("userId", "username"); // Hämta användarnamn
        if (reviews.length === 0) {
            return h.response("Inga recensioner hittades för boken.").code(404);
        }
        return reviews;
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Hämta en specifik recension utifrån ID
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
        const { bookId, reviewText, rating } = request.payload;     // Hämta bokid, recension och betyg från payload
        const userId = request.auth.credentials.id;                 // Hämta inloggad användare från token

        if (!bookId || !reviewText || rating == null) {
            return h.response({ error: "Alla fält måste vara ifyllda" }).code(400);
        }

        const review = new Review({ bookId, userId, reviewText, rating });     // Skapa en ny recension med bokid, användarid, recension och betyg
        await review.save();

        return h.response(review).code(201);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Uppdatera en recension (bara egna recensioner)
exports.updateReview = async (request, h) => {
    try {
        const { id } = request.params;
        const updates = request.payload;
        const userId = request.auth.credentials.id;         // Id från inloggad användare

        // Kontroll att recensionen finns och att det är rätt användare
        const review = await Review.findOneAndUpdate(
            { _id: id, userId: userId }, 
            updates, { new: true } 
        );

        if (!review) return h.response("Recensionen hittades inte eller fel behörighet").code(404);

        return h.response(review).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};

// Ta bort en recension (bara egen recensioner)
exports.deleteReview = async (request, h) => {
    try {
        const review = await Review.findById(request.params.id);
        if (!review) return h.response("Recensionen hittades inte").code(404);

        // Kontroll om korrekt användare
        if (review.userId.toString() !== request.auth.credentials.id) {
            return h.response("Du kan bara ta bort dina egna recensioner").code(403);
        }

        await review.deleteOne();
        return h.response({ message: "Recension raderad" }).code(204);
    } catch (err) {
        return h.response({ error: err.message }).code(500);
    }
};
