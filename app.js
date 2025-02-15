const express = require('express');
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware"); 
const controllers = require('./controllers/controllers'); 
const mysql = require('mysql2');  // Importamos mysql2 en lugar de mysql

const app = express();
const PORT = 5555;

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',     // Servidor de la base de datos
    user: 'root',          // Usuario de MySQL (sin @%)
    password: 'root',      // Contraseña de MySQL
    database: 'USERS',     // Nombre de la base de datos
    port: 3307
});

// Conectar a la base de datos
connection.connect((error) => {
    if (error) {
        console.error('Error de conexión:', error);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

app.use(express.json()); // Permitir recibir JSON en las solicitudes

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ error: 'Error en la consulta' });
            return;
        }
        res.json(results);
    });
});

// Endpoint route
app.get("/endpoint", controllers.endpointHandler);

// forzar-error route
app.get("/forzar-error", controllers.forzarError);

// Middleware para manejar rutas no encontradas (404)
app.use(notFoundMiddleware);

// Middleware para manejar errores internos (500)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
