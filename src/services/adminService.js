const connection = require('../config/db');

const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, username, type FROM users', (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const deleteUser = async (userId) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

module.exports = { getAllUsers, deleteUser };
