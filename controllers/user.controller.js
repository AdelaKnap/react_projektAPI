/* Controllers för användare */

const User = require('../models/user.model');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Funktion för att hämta alla användare
exports.getAllUsers = async (request, h) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return h.response("Inga användare hittades").code(404);
        }
        return h.response(users).code(200);
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Funktion för att hämta en användare utifrån id
exports.getUserById = async (request, h) => {
    try {
        const user = await User.findById(request.params.id);
        return user || h.response("Användaren hittades inte").code(404);
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Skapa ny användare med hashat lösenord
exports.createUser = async (request, h) => {
    try {
        const { username, password } = request.payload;

        // Kontrollera om användaren redan finns
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return h.response({ message: "Användarnamnet är upptaget. Välj ett annat användarnamn." }).code(400);
        }

        // Hasha lösenordet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Skapa ny användare
        const user = new User({
            username,
            password: hashedPassword
        });

        const savedUser = await user.save();
        return h.response(savedUser).code(201);

    } catch (err) {
        console.error(err);
        return h.response({ message: err.message }).code(500);
    }
};

// Uppdatera användare
exports.updateUser = async (request, h) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        if (!updatedUser) {
            return h.response("Användaren hittades inte och gick inte att uppdatera").code(404);
        }
        return h.response(updatedUser).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

// Radera en användare
exports.deleteUser = async (request, h) => {
    try {
        const user = await User.findByIdAndDelete(request.params.id);
        return user || h.response("Användaren hittades inte och gick inte att radera").code(404);
    } catch (err) {
        return h.response(err).code(500);
    }
};

// Logga in användare
exports.loginUser = async (request, h) => {
    // hämta data som användaren angett från payload
    const { username, password } = request.payload;

    try {
        let user = await User.findOne({ username: username });

        // Om användarnamnet stämmer/finns
        if (!user) {
            return h.response({ message: "Felaktigt användarnamn eller lösenord" }).code(401);
        }

        // Jämför det angivna lösenordet med det hashade 
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return h.response({ message: "Felaktigt användarnamn eller lösenord" }).code(401);
        }

        user = await User.findOne({ username: username }, { password: 0 });  // Exkludera lösenordet

        const token = generateToken(user);  // Skapa token

        // Skicka med användardata 
        return h
            .response({
                message: "Du har loggats in",
                user: user,
            })
            .state('jwt', token);

    } catch (err) {
        console.error(err);
        return h.response({ message: err.message }).code(500);
    }
};

// Hämta aktuell användare
exports.getCurrentUser = async (request, h) => {
    try {
        const user = request.auth.credentials; // Hämtar dekrypterad användardata från cookien

        if (!user) {
            return h.response({ message: "Ingen aktiv session" }).code(401);
        }

        return h.response({ user }).code(200);
    } catch (err) {
        console.error("Fel vid hämtning av aktuell användare:", err);
        return h.response({ message: "Fel vid hämtning av användare" }).code(500);
    }
};

// Logga ut användare
exports.logoutUser = async (request, h) => {
    try {
        // Ta bort/förstör cookien, motsatsen till state
        h.unstate('jwt');

        return h.response({ message: "Du har loggats ut." }).code(200);
    } catch (err) {
        return h.response({ err: "Utloggningen misslyckades" }).code(500);
    }
};

// Funtion för att generera token, giltig 24h
const generateToken = (user) => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_SECRET_KEY, algorithm: 'HS256' },
        { ttlSec: 24 * 60 * 60 * 1000 }
    );

    return token;
};