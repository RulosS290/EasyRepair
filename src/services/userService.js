const connection = require('../config/db');

const getUserById = async (userId) => {
    try {
        const [results] = await connection.query(
            'SELECT id, username, type FROM users WHERE id = ?',
            [userId]
        );

        if (results.length === 0) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        return results[0];
    } catch (error) {
        throw { status: 500, message: 'Error en el servidor' };
    }
};

module.exports = { getUserById };
