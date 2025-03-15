// Inställningar för servern
const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./auth');    // Hämta auth-filen

// Initierar servern
const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: 'localhost',       // för att lyssna på alla IP-adresser: host: '0.0.0.0', lokalt host: 'localhost'
        routes: {
            // Vilka domäner som tillåts, tillåta cookies, tidsbegräning på cookies och headers
            cors: {
                origin: ['*'],
                credentials: true,
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        }
    });

    // Anslutning till databasen MongoDB
    Mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Ansluten till MongoDB");
    }).catch((error) => {
        console.error("Fel vid anslutning till databas: " + error);
    });

    // Registrera autentisiernings strategin
    await auth.register(server);

    // Routes
    require("./routes/review.route")(server);
    require("./routes/user.route")(server);

    // Starta servern
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Hantera oavsiktliga undantag
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// Kalla på funktionen och starta servern
init();