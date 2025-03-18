const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Obtener mensajes de una cita (appointment)
router.get('/chat/:appointmentId', authenticateToken, chatController.getMessagesByAppointment);

// Enviar un nuevo mensaje en una cita
router.post('/chat/:appointmentId', authenticateToken, chatController.createMessage);

module.exports = router;
