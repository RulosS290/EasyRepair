const authService = require('../services/authService');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { loginUser };
