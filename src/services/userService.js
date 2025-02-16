const connection = require('../config/db');

const getUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, username, type FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) return reject({ status: 500, message: 'Error en el servidor' });
            if (results.length === 0) return reject({ status: 404, message: 'Usuario no encontrado' });

            resolve(results[0]);
        });
    });
};

module.exports = { getUserById };
