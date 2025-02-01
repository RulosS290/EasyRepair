const express = require('express');
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware"); 
const controllers = require('./controllers/controllers'); 

const app = express();
const PORT = 5555;

// Endpoint route
app.get("/endpoint", controllers.endpointHandler);

// forzar-error route
app.get("/forzar-error", controllers.forzarError);

// Middleware para manejar rutas no encontradas (404)
app.use(notFoundMiddleware);

// Middleware para manejar errores internos (500)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});

