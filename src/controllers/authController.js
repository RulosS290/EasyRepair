const authService = require('../services/authService');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, password, type } = req.body;
        const result = await authService.register(username, password, type);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

module.exports = { loginUser, registerUser };
