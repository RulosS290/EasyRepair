const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

router.get('/appointments/form', appointmentsController.showAppointmentsForm);
router.post('/appointments', appointmentsController.createAppointment);
router.get('/appointments/:user_id', appointmentsController.getAppointmentsByUser); // Ruta para obtener citas
router.get('/technicians', appointmentsController.getTechnicians);

module.exports = router;
