/* ROUTES */

// import av controllern och validation
const { options } = require("joi");
const userController = require("../controllers/user.controller");
const { userValidation } = require("../middleware/validateuser");

// Routes med funktioner via controllern
module.exports = (server) => {
    server.route([

        // Routes med GET
        {
            method: 'GET',
            path: '/users',
            handler: userController.getAllUsers,
            options: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/users/{id}',
            handler: userController.getUserById,
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/users/logout",
            handler: userController.logoutUser,
            options: {
                auth: false
            }
        },

        {
            method: "GET",
            path: "/users/checkSession",
            handler: userController.getCurrentUser,
            options: {
                auth: "session"  // Kräver att användaren är autentiserad
            }
        },

        // Routes med POST
        {
            method: 'POST',
            path: '/users',
            handler: userController.createUser,
            options: {
                auth: false,
                validate: {
                    payload: userValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/users/login',
            handler: userController.loginUser,
            options: {
                auth: false,
                validate: {
                    payload: userValidation,
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },

        // PUT
        {
            method: 'PUT',
            path: '/users/{id}',
            handler: userController.updateUser,
            options: {
                auth: false
            }
        },

        // DELETE
        {
            method: 'DELETE',
            path: '/users/{id}',
            handler: userController.deleteUser,
            options: {
                auth: false
            }
        }
    ]);
};
