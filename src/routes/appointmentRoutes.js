const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/user/schedule', authenticateToken, appointmentController.getAppointments);

router.post('/appointments', authenticateToken, appointmentController.addAppointment); 

router.get('/appointmentsGetTechnicians', authenticateToken, appointmentController.getTechnicians);

router.patch('/appointments/pay/:id', appointmentController.updateAppointmentPaid);

router.delete('/appointments/:id', authenticateToken, appointmentController.deleteAppointment);

router.patch('/appointments/:id', authenticateToken, appointmentController.updateAppointment);

router.patch('/appointments/rate/:id', appointmentController.updateAppointmentRate);

module.exports = router;
