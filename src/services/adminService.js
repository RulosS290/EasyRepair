const connection = require('../config/db');

const getAllUsers = async () => {
    try {
        const results = await connection.query('SELECT id, username, type FROM users');
        return results;
    } catch (error) {
        throw { status: 500, message: 'Error al obtener los usuarios', error };
    }
};

const deleteUser = async (userId) => {
    try {
        const results = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        if (results.affectedRows === 0) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }
        return { status: 200, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
        throw { status: 500, message: 'Error al eliminar usuario', error };
    }
};

module.exports = { getAllUsers, deleteUser };
