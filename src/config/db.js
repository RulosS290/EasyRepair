const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'USERS',
    port: 3307
});

connection.connect((error) => {
    if (error) {
        console.error('Error de conexión a MySQL:', error);
        return;
    }
    console.log('✅ Conexión exitosa a MySQL');
});

module.exports = connection;
