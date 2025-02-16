const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');
require('dotenv').config();

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const user = results[0];

            const token = jwt.sign(
                { id: user.id, username: user.username, type: user.type },
                process.env.SECRET_KEY || 'clave_secreta',
                { expiresIn: '1h' }
            );

            res.json({ token });
        }
    );
});

module.exports = router;
