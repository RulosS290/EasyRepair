const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/payment', (req, res) => {
    const appointmentId = req.query.id;
    if (!appointmentId) {
        return res.status(400).send('ID de cita no proporcionado');
    }
});

module.exports = router;
