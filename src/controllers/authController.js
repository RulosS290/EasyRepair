const authService = require('../services/authService');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`[INFO] Login attempt for username: ${username}`);

        const result = await authService.login(username, password);
        console.log(`[SUCCESS] User ${username} logged in successfully`);

        res.json(result);
    } catch (error) {
        console.error(`[ERROR] Login failed for username: ${req.body.username}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, password, type } = req.body;
        console.log(`[INFO] Registration attempt for username: ${username}, type: ${type}`);

        const result = await authService.register(username, password, type);
        console.log(`[SUCCESS] User ${username} registered successfully`);

        res.status(201).json(result);
    } catch (error) {
        console.error(`[ERROR] Registration failed for username: ${req.body.username}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = { loginUser, registerUser };
