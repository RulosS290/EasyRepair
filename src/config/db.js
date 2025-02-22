const mysql = require('mysql2/promise'); // Importa la versión con promesas

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'USERS',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;
