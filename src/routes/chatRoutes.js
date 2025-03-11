const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Obtener mensajes de una cita (appointment)
router.get('/chat/:appointmentId', chatController.getMessagesByAppointment);

// Enviar un nuevo mensaje en una cita
router.post('/chat/:appointmentId', chatController.createMessage);

module.exports = router;
