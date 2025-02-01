// endpoint controller
const endpointHandler = (req, res) => {
    res.send("Endpoint prueba sprint 1");
};

// forzar-error controller
const forzarError = (req, res) => {
    throw new Error('Error simulado');
};

module.exports = { endpointHandler, forzarError };
