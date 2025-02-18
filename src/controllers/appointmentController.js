const appointmentService = require('../services/appointmentService');

// Obtener citas de un usuario
const getAppointments = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario desde el token (asumimos que lo has almacenado en req.user)
    try {
        const appointments = await appointmentService.getAppointmentsByUserId(userId);
        console.log(appointments);
        if (appointments.status !== 200) {
            return res.json({ appointments });
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error('Error al obtener las citas:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Agregar una cita para un usuario
const addAppointment = async (req, res) => { // Renombré esta función para que sea más coherente
    try {
        const appointment = await appointmentService.addAppointment(req.user.id, req.body.technicianId, req.body.datetime, req.body.device, req.body.cost); // El cuerpo de la solicitud contiene los datos de la cita
        res.json(appointment);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

// Obtener todos los técnicos
const getTechnicians = async (req, res) => {
    try {
        // Usar el servicio para obtener todos los técnicos
        const technicians = await appointmentService.getAllTechnicians();
        res.json(technicians);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { getAppointments, addAppointment, getTechnicians };
