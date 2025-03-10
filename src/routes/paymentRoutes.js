const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/payment', (req, res) => {
    const appointmentId = req.query.id;
    if (!appointmentId) {
        return res.status(400).send('Appointment ID not provided');
    }
    res.sendFile(path.join(__dirname, '../views/payment.html'));
});

module.exports = router;
