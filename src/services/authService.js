const connection = require('../config/db');

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (error, results) => {
                if (error) {
                    reject({ error: 'Error interno del servidor' });
                }

                if (results.length === 0) {
                    reject({ error: 'Credenciales incorrectas' });
                }

                resolve(results[0]);
            }
        );
    });
};

const register = (username, password, type) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (error, results) => {
                if (error) {
                    reject({ error: 'Error interno del servidor' });
                    return;
                }

                if (results.length > 0) {
                    reject({ error: 'El usuario ya existe' });
                    return;
                }

                connection.query(
                    'INSERT INTO users (username, password, type) VALUES (?, ?, ?)',
                    [username, password, type],
                    (error, results) => {
                        if (error) {
                            reject({ error: 'Error al registrar el usuario' });
                            return;
                        }

                        resolve({ message: 'Usuario registrado exitosamente' });
                    }
                );
            }
        );
    });
};

module.exports = { login, register };
