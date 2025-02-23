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

const updateAppointmentPaid = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const result = await appointmentService.updateAppointmentPaid(appointmentId);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(error.status || 500).json({ error: error.message || 'Error en el servidor' });
    }
};

const updateAppointmentRate = async (req, res) => {
    const appointmentId = req.params.id; 
    const { rate } = req.body; 

    if (!rate) {
        return res.status(400).json({ message: 'Debe proporcionar una calificación' });
    }

    try {
        const result = await appointmentService.updateAppointmentRate(appointmentId, rate);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error al actualizar la calificación:', error);
        res.status(error.status || 500).json({ error: error.message || 'Error en el servidor' });
    }
};


const deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const result = await appointmentService.deleteAppointment(appointmentId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.status(200).json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { datetime, device, paid } = req.body;

    if (!datetime || !device || paid === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const result = await appointmentService.updateAppointment(appointmentId, datetime, device, paid);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(error.status || 500).json({ error: error.message || 'Error en el servidor' });
    }
};

module.exports = { getAppointments, addAppointment, getTechnicians, updateAppointmentPaid, deleteAppointment, updateAppointment, updateAppointmentRate };


