const express = require('express');
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const app = express();
const PORT = 5555;

app.get("/endpoint", (req, res) => {
    res.send("Endpoint prueba sprint 1");
});

app.get('/forzar-error', (req, res) => {
    throw new Error('Error simulado');
});

// 404 error middleware for non-existent routes.
app.use(notFoundMiddleware);

// Middleware to handle internal errors (500)
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});
