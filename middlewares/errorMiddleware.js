const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Imprime el error en la consola
    res.status(500).json({ error: "Algo salió mal en el servidor" });
};

module.exports = errorMiddleware;
