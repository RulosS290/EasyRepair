const connection = require('../config/db');

const getAllUsers = async () => {
    try {
        const results = await connection.query('SELECT id, username, type FROM users');
        console.log("Successfully retrieved users:", results);
        return results;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw { status: 500, message: 'Error retrieving users', error };
    }
};

const deleteUser = async (userId) => {
    try {
        const [results] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        if (results.affectedRows === 0) {
            console.warn("User not found for deletion:", userId);
            throw { status: 404, message: 'User not found' };
        }

        console.log("User successfully deleted:", userId);
        return { status: 200, message: 'User successfully deleted' };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw { status: 500, message: 'Error deleting user', error };
    }
};

module.exports = { getAllUsers, deleteUser };

