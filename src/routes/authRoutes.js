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
            process.env.SECRET_KEY || 'default_secret_key',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, type } = req.body;

    try {
        const result = await authService.register(username, password, type);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
});

module.exports = router;
