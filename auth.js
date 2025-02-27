/* Inställningar för autentisiering */

const Cookie = require('@hapi/cookie');
const Jwt = require('@hapi/jwt');
require('dotenv').config();

module.exports = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        // Registrera för cookies
        server.auth.strategy('session', 'cookie', {
            cookie: {
                // inställningar för cookies
                name: 'jwt',
                password: process.env.COOKIE_PASSWORD,
                isSecure: true,
                path: '/',
                ttl: 24 * 60 * 60 * 1000,
                isSameSite: 'None',
                clearInvalid: true,
                isHttpOnly: true
            },
            // validering av cookie
            validate: async (request, session) => {
                try {
                    const token = session; // Hämta token

                    if (!token) {
                        return { isValid: false };
                    }

                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_SECRET_KEY,
                            algorithms: ['HS256']
                        });

                        // Om korrekt token
                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };

                    } catch (err) {
                        console.error("Felaktig verifiering av token:", err);
                        return { isValid: false };
                    }

                } catch (err) {
                    console.error("Fel vid validering:", err);
                    return { isValid: false };
                }
            }
        });

        // Sätt autentisiering för alla routes
        server.auth.default('session');
    }
};

