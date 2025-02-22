const connection = require('../config/db');

const login = async (username, password) => {
    try {
        const [results] = await connection.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (results.length === 0) {
            throw { error: 'Credenciales incorrectas' };
        }

        return results[0];
    } catch (error) {
        throw { error: 'Error interno del servidor' };
    }
};

const register = async (username, password, type) => {
    try {
        const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            throw { error: 'El usuario ya existe' };
        }

        await connection.query(
            'INSERT INTO users (username, password, type) VALUES (?, ?, ?)',
            [username, password, type]
        );

        return { message: 'Usuario registrado exitosamente' };
    } catch (error) {
        throw { error: 'Error interno del servidor' };
    }
};

module.exports = { login, register };
