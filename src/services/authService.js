const bcrypt = require('bcryptjs');
const connection = require('../config/db');

const login = async (username, password) => {
    try {
        console.log(`[INFO] Attempting login for user: ${username}`);
        const [results] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (results.length === 0) {
            console.log(`[ERROR] Login failed: User ${username} not found.`);
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[ERROR] Login failed: Incorrect password for user ${username}.`);
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        console.log(`[INFO] Login successful for user: ${username}`);
        return user;
    } catch (error) {
        console.error(`[ERROR] Error during login for user ${username}:`, error);
        throw { statusCode: 500, message: 'Internal server error' };
    }
};

const register = async (username, password, type) => {
    try {
        console.log(`[INFO] Attempting registration for user: ${username}`);
        const [existingUser] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            console.log(`[ERROR] Registration failed: User ${username} already exists.`);
            throw { statusCode: 409, message: 'User already exists' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.query(
            'INSERT INTO users (username, password, type) VALUES (?, ?, ?)',
            [username, hashedPassword, type]
        );

        console.log(`[INFO] User registered successfully: ${username}`);
        return { message: 'User registered successfully' };
    } catch (error) {
        console.error(`[ERROR] Error during registration for user ${username}:`, error);
        throw { statusCode: 500, message: 'Internal server error' };
    }
};

module.exports = { login, register };