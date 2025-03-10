const connection = require('../config/db');

const getAllUsers = async () => {
    try {
        const results = await connection.query('SELECT id, username, type FROM users');
        console.log("[INFO] Successfully retrieved users:", results);
        return results;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw { status: 500, message: '[ERROR] Error retrieving users', error };
    }
};

const deleteUser = async (userId) => {
    try {
        const [results] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        if (results.affectedRows === 0) {
            console.warn("User not found for deletion:", userId);
            throw { status: 404, message: '[ERROR] User not found' };
        }

        console.log("User successfully deleted:", userId);
        return { status: 200, message: 'User successfully deleted' };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw { status: 500, message: '[ERROR] Error deleting user', error };
    }
};

module.exports = { getAllUsers, deleteUser };



