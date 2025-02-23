const connection = require('../config/db');

const getAllUsers = async () => {
    try {
        const results = await connection.query('SELECT id, username, type FROM users');
        return results;
    } catch (error) {
        throw { status: 500, message: 'Error retrieving users', error };
    }
};

const deleteUser = async (userId) => {
    try {
        const [results] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

        if (results.affectedRows === 0) {
            throw { status: 404, message: 'User not found' };
        }

        return { status: 200, message: 'User successfully deleted' };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw { status: 500, message: 'Error deleting user', error };
    }
};


module.exports = { getAllUsers, deleteUser };
