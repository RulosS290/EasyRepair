const express = require('express');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.login(username, password);

        const token = jwt.sign(
            { id: user.id, username: user.username, type: user.type },
            process.env.SECRET_KEY || 'clave_secreta',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/register', async (req, res) => {
    const { username, password, type } = req.body;

    try {
        const result = await authService.register(username, password, type);
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
