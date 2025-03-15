/* ROUTES */

// import av controllern och validation
const reviewController = require("../controllers/review.controller");
const { reviewValidation } = require("../middleware/validatereview");
const auth = require("../auth");

// routes med funktioner via controllern
module.exports = (server) => {
    server.route([
        {
            method: "GET",
            path: "/",
            handler: (request, h) => {
                return h.response({
                    message: "Välkommen till Adelas API",
                });
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/reviews/all",
            handler: reviewController.getAllReviews,
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/reviews",
            handler: reviewController.getReviewsByBook,
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/reviews/user",
            handler: reviewController.getReviewsByUser
        },
        {
            method: "GET",
            path: "/reviews/{id}",
            handler: reviewController.getOneReview,
            options: {
                auth: false
            }
        },
        {
            method: "POST",
            path: "/reviews",
            handler: reviewController.addNewReview,
            options: {
                validate: {
                    payload: reviewValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                },
            }
        },
        {
            method: "PUT",
            path: "/reviews/{id}",
            handler: reviewController.updateReview,
            options: {
                validate: {
                    payload: reviewValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: "/reviews/{id}",
            handler: reviewController.deleteReview,
        }
    ]);
};
