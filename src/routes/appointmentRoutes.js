const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/authMiddleware'); // Asegúrate de que el middleware esté protegiendo las rutas adecuadamente

const router = express.Router();

router.get('/user/schedule', authenticateToken, appointmentController.getAppointments);

router.post('/appointments', authenticateToken, appointmentController.addAppointment); // Cambié el método a POST para agregar la cita

router.get('/appointmentsGetTechnicians', authenticateToken, appointmentController.getTechnicians);


module.exports = router;
