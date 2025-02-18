const appointmentService = require('../services/appointmentService');

const getAppointments = async (req, res) => {
    const userId = req.user.id; 
    try {
        const appointments = await appointmentService.getAppointmentsByUserId(userId);
        if (appointments.status !== 200) {
            return res.json({ appointments });
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error('Error al obtener las citas:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const addAppointment = async (req, res) => { 
    try {
        const appointment = await appointmentService.addAppointment(req.user.id, req.body.technicianId, req.body.datetime, req.body.device, req.body.cost); 
        res.json(appointment);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getTechnicians = async (req, res) => {
    try {
        const technicians = await appointmentService.getAllTechnicians();
        res.json(technicians);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { getAppointments, addAppointment, getTechnicians };
