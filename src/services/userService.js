const connection = require('../config/db');

const getUserById = async (userId) => {
    try {
        console.log(`[INFO] Searching for user with ID: ${userId}`);
        const [results] = await connection.query(
            'SELECT id, username, type FROM users WHERE id = ?',
            [userId]
        );

        if (results.length === 0) {
            console.warn(`Usuario con ID ${userId} no encontrado`);
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        console.log(`[INFO] User found: ${JSON.stringify(results[0])}`);
        return results[0];
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve user with ID ${userId}:`, error);
        throw { status: 500, message: 'Server error' };
    }
};

module.exports = { getUserById };
