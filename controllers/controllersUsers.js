const path = require('path');
const connection = require('../config/db'); 

// Show the login form
const showLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};

// Process the login
const loginUser = (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                return res.status(500).send('Error en el servidor');
            }

            if (results.length > 0) {
                res.send(`<h2>Bienvenido, ${username}!</h2>`);
            } else {
                res.send('<h2>Usuario o contraseña incorrectos</h2>');
            }
        }
    );
};

// endpoint controller
const endpointHandler = (req, res) => {
    res.send("Endpoint prueba sprint 1");
};

// forzar-error controller
const forzarError = (req, res) => {
    throw new Error('Error simulado');
};

module.exports = { endpointHandler, forzarError, showLoginPage, loginUser };
