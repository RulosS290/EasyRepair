const appointmentService = require('../services/appointmentService');

const getAppointments = async (req, res) => {
    const userId = req.user.id; 
    console.log(`[INFO] Fetching appointments for user ID: ${userId}`);

    try {
        const appointments = await appointmentService.getAppointmentsByUserId(userId);
        if (appointments.status !== 200) {
            console.warn(`[WARNING] No appointments found for user ID: ${userId}`);
            return res.json({ appointments });
        }

        console.log(`[SUCCESS] Appointments retrieved for user ID: ${userId}`);
        res.status(200).json(appointments);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch appointments for user ID: ${userId}:`, err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addAppointment = async (req, res) => { 
    try {
        console.log(`[INFO] Adding new appointment for user ID: ${req.user.id}`);
        const appointment = await appointmentService.addAppointment(
            req.user.id, 
            req.body.technicianId, 
            req.body.datetime, 
            req.body.device, 
            req.body.cost
        );
        console.log(`[SUCCESS] Appointment created for user ID: ${req.user.id}`);
        res.json(appointment);
    } catch (error) {
        console.error(`[ERROR] Failed to add appointment for user ID: ${req.user.id}:`, error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const getTechnicians = async (req, res) => {
    try {
        console.log(`[INFO] Fetching all technicians`);
        const technicians = await appointmentService.getAllTechnicians();
        console.log(`[SUCCESS] Retrieved ${technicians.length} technicians`);
        res.json(technicians);
    } catch (error) {
        console.error(`[ERROR] Failed to fetch technicians:`, error);
        res.status(error.status || 500).json({ error: error.message });
    }
};

const updateAppointmentPaid = async (req, res) => {
    const appointmentId = req.params.id;
    console.log(`[INFO] Marking appointment ID: ${appointmentId} as paid`);

    try {
        const result = await appointmentService.updateAppointmentPaid(appointmentId);
        console.log(`[SUCCESS] Appointment ID: ${appointmentId} marked as paid`);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(`[ERROR] Failed to mark appointment ID: ${appointmentId} as paid:`, error);
        res.status(error.status || 500).json({ error: error.message || 'Server error' });
    }
};

const updateAppointmentRate = async (req, res) => {
    const appointmentId = req.params.id; 
    const { rate } = req.body; 

    if (!rate) {
        console.warn(`[WARNING] Rating is missing for appointment ID: ${appointmentId}`);
        return res.status(400).json({ message: 'Rating is required' });
    }

    try {
        console.log(`[INFO] Updating rating for appointment ID: ${appointmentId}`);
        const result = await appointmentService.updateAppointmentRate(appointmentId, rate);
        console.log(`[SUCCESS] Rating updated for appointment ID: ${appointmentId}`);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(`[ERROR] Failed to update rating for appointment ID: ${appointmentId}:`, error);
        res.status(error.status || 500).json({ error: error.message || 'Server error' });
    }
};

const deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    console.log(`[INFO] Deleting appointment ID: ${appointmentId}`);

    try {
        const result = await appointmentService.deleteAppointment(appointmentId);
        if (result.affectedRows === 0) {
            console.warn(`[WARNING] Appointment ID: ${appointmentId} not found`);
            return res.status(404).json({ error: 'Appointment not found' });
        }
        console.log(`[SUCCESS] Appointment ID: ${appointmentId} deleted`);
        res.status(200).json({ message: 'Appointment successfully deleted' });
    } catch (error) {
        console.error(`[ERROR] Failed to delete appointment ID: ${appointmentId}:`, error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { datetime, device, paid } = req.body;

    if (!datetime || !device || paid === undefined) {
        console.warn(`[WARNING] Missing fields for updating appointment ID: ${appointmentId}`);
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        console.log(`[INFO] Updating appointment ID: ${appointmentId}`);
        const result = await appointmentService.updateAppointment(appointmentId, datetime, device, paid);
        console.log(`[SUCCESS] Appointment ID: ${appointmentId} updated`);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error(`[ERROR] Failed to update appointment ID: ${appointmentId}:`, error);
        res.status(error.status || 500).json({ error: error.message || 'Server error' });
    }
};

const getUserRatingAverage = async (req, res) => {
    const { userId } = req.params;
    console.log(`[INFO] Fetching user rating average for user ID: ${userId}`);

    try {
        const result = await appointmentService.getUserRatingAverage(userId);
        if (result.status === 404) {
            console.warn(`[WARNING] No ratings found for user ID: ${userId}`);
            return res.status(404).json({ error: result.message });
        }
        console.log(`[SUCCESS] User rating average retrieved for user ID: ${userId}`);
        return res.status(200).json({ average: result.average });
    } catch (error) {
        console.error(`[ERROR] Failed to fetch user rating average for user ID: ${userId}:`, error);
        return res.status(500).json({ error: "Error fetching user rating average" });
    }
};

const getTechnicianRatingAverage = async (req, res) => {
    const { technicianId } = req.params;
    console.log(`[INFO] Fetching rating average for technician ID: ${technicianId}`);

    try {
        const result = await appointmentService.getTechnicianRatingAverage(technicianId);
        if (result.status === 404) {
            console.warn(`[WARNING] No ratings found for technician ID: ${technicianId}`);
            return res.status(404).json({ error: result.message });
        }
        console.log(`[SUCCESS] Technician rating average retrieved for technician ID: ${technicianId}`);
        return res.status(200).json({ average: result.average });
    } catch (error) {
        console.error(`[ERROR] Failed to fetch technician rating average for technician ID: ${technicianId}:`, error);
        return res.status(500).json({ error: "Error fetching technician rating average" });
    }
};

module.exports = { getAppointments, addAppointment, getTechnicians, updateAppointmentPaid, deleteAppointment, updateAppointment, updateAppointmentRate, getUserRatingAverage, getTechnicianRatingAverage };
