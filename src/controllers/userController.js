const userService = require('../services/userService');

const getUserInfo = async (req, res) => {
    const userId = req.user.id;
    console.log(`[INFO] User ID: ${userId} requested their information`);

    try {
        const user = await userService.getUserById(userId);
        console.log(`[SUCCESS] User information retrieved successfully for User ID: ${userId}`);
        res.json(user);
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve user information for User ID: ${userId}: ${error.message}`);
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { getUserInfo };
