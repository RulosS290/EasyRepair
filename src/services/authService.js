const bcrypt = require('bcryptjs');
const connection = require('../config/db');

const login = async (username, password) => {
    try {
        const [results] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (results.length === 0) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        return user;
    } catch (error) {
        console.error(error);
        throw { statusCode: 500, message: 'Internal server error' };
    }
};

const register = async (username, password, type) => {
    try {
        const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            throw { statusCode: 409, message: 'User already exists' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.query(
            'INSERT INTO users (username, password, type) VALUES (?, ?, ?)',
            [username, hashedPassword, type]
        );

        return { message: 'User registered successfully' };
    } catch (error) {
        console.error(error);
        throw { statusCode: 500, message: 'Internal server error' };
    }
};

module.exports = { login, register };
