const userService = require('../services/userService');

const getUserInfo = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { getUserInfo };
