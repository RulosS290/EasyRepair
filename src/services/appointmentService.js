const connection = require('../config/db');

const getAppointmentsByUserId = async (userId) => {
    try {
        const [appointments] = await connection.query(
            `SELECT * FROM appointments WHERE user_id = ? OR technician_id = ?`,
            [userId, userId]
        );
        
        if (appointments.length === 0) {
            console.warn(`[WARNING] No appointments found for user ${userId}`);
            throw { status: 404, message: 'No hay citas encontradas' };
        }
        
        const userIds = [...new Set(appointments.flatMap(a => [a.user_id, a.technician_id]))];
        const [users] = await connection.query(
            `SELECT id, username FROM users WHERE id IN (?)`,
            [userIds]
        );
        
        const usersMap = Object.fromEntries(users.map(u => [u.id, u.username]));
        console.log(`[INFO] Appointments retrieved successfully for user ${userId}`);
        
        return appointments.map(a => ({
            id: a.id,
            datetime: a.datetime,
            device: a.device,
            cost: a.cost,
            paid: a.paid === 1,
            related_user_name: userId === a.technician_id ? usersMap[a.user_id] : usersMap[a.technician_id]
        }));
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error retrieving appointments' };
    }
};

const addAppointment = async (userId, technicianId, datetime, device, cost = 1) => {
    try {
        if (!userId || !technicianId || !datetime || !device || !cost) {
            throw { status: 400, message: 'Missing required appointment data' };
        }
        
        technicianId = Number(technicianId);
        datetime = new Date(datetime);
        
        const [technicianResults] = await connection.query(
            `SELECT id, username FROM users WHERE id = ? AND type = 'technical'`,
            [technicianId]
        );
        
        if (technicianResults.length === 0) {
            throw { status: 404, message: 'Technician not found' };
        }
        
        const technician = technicianResults[0];
        
        const [results] = await connection.query(
            `INSERT INTO appointments (user_id, technician_id, datetime, device, cost, paid) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, technicianId, datetime, device, cost, 0]
        );
        
        console.log(`[INFO] Appointment added successfully with ID ${results.insertId}`);
        
        return { 
            id: results.insertId, 
            userId, 
            technicianId, 
            technicianName: technician.username, 
            datetime, 
            device, 
            cost, 
            paid: 0 
        };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al agregar cita' };
    }
};

const updateAppointmentPaid = async (appointmentId) => {
    try {
        const [results] = await connection.query(
            `UPDATE appointments SET paid = 1 WHERE id = ? AND paid = 0`,
            [appointmentId]
        );
        
        if (results.affectedRows === 0) {
            console.warn(`Appointment ${appointmentId} is already paid or does not exist`);
            throw { status: 400, message: 'The appointment is already paid or does not exist' };
        }
        
        console.log(`[INFO] Payment registered successfully for appointment ${appointmentId}`);
        return { status: 200, message: 'Payment successfully recorded' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error updating payment' };
    }
};

const updateAppointmentRate = async (appointmentId, rate) => {
    try {
        console.log(`[INFO] Searching for appointment with ID: ${appointmentId}`);
        const [appointment] = await connection.query(
            `SELECT technician_rate, user_rate FROM appointments WHERE id = ?`,
            [appointmentId]
        );

        if (appointment.length === 0) {
            throw { status: 400, message: 'The appointment does not exist' };
        }

        let fieldToUpdate;

        if (appointment[0].technician_rate === null) {
            fieldToUpdate = 'technician_rate';
        } else if (appointment[0].user_rate === null) {
            fieldToUpdate = 'user_rate';
        } else {
            throw { status: 400, message: 'The appointment has already been fully rated' };
        }

        console.log(`[INFO] Updating field: ${fieldToUpdate} with value: ${rate}`);

        const [results] = await connection.query(
            `UPDATE appointments SET ${fieldToUpdate} = ? WHERE id = ?`,
            [rate, appointmentId]
        );

        if (results.affectedRows === 0) {
            throw { status: 400, message: 'Failed to update rating' };
        }

        console.log(`[INFO] Rating successfully recorded for appointment ID: ${appointmentId}`);
        return { status: 200, message: 'Rating successfully recorded' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al actualizar la calificación' };
    }
};

const getAllTechnicians = async () => {
    try {
        console.log(`[INFO] Searching for all technicians`);
        const [results] = await connection.query(
            `SELECT id, username FROM users WHERE type = 'technical'`
        );

        if (results.length === 0) {
            throw { status: 404, message: 'No technicians found' };
        }

        console.log(`[INFO] Found ${results.length} technicians`);
        return results;
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error retrieving technicians' };
    }
};


const deleteAppointment = async (appointmentId) => {
    try {
        const [results] = await connection.query(
            `DELETE FROM appointments WHERE id = ?`,
            [appointmentId]
        );
        
        if (results.affectedRows === 0) {
            console.warn(`[WARNING] Appointment ${appointmentId} not found`);
            throw { status: 404, message: 'Appointment not found' };
        }
        
        console.log(`[SUCCESS] Appointment ${appointmentId} deleted successfully`);
        return { status: 200, message: 'Appointment successfully deleted' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Server error' };
    }
};

const updateAppointment = async (appointmentId, datetime, device, paid) => {
    try {
        const [results] = await connection.query(
            `UPDATE appointments SET datetime = ?, device = ?, paid = ? WHERE id = ?`,
            [datetime, device, paid, appointmentId]
        );
        
        if (results.affectedRows === 0) {
            throw { status: 404, message: 'Appointment not found' };
        }
        
        return { status: 200, message: 'Appointment updated successfully' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error updating the appointment' };
    }
};

const getUserRatingAverage = async (userId) => {
    try {
        const [appointments] = await connection.query(
            `SELECT user_rate FROM appointments WHERE user_id = ? AND user_rate IS NOT NULL`,
            [userId]
        );
        
        if (!appointments || appointments.length === 0) {
            return { status: 404, message: "No ratings found for this user." };
        }
        
        const userRatings = appointments.map(appointment => appointment.user_rate);
        const average = userRatings.reduce((sum, rate) => sum + rate, 0) / userRatings.length;
        
        return { status: 200, average };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error calculating user rating average." };
    }
};

const getTechnicianRatingAverage = async (technicianId) => {
    try {
        const [appointments] = await connection.query(
            `SELECT technician_rate FROM appointments WHERE technician_id = ? AND technician_rate IS NOT NULL`,
            [technicianId]
        );
        
        if (!appointments || appointments.length === 0) {
            return { status: 404, message: "No ratings found for this technician." };
        }
        
        const technicianRatings = appointments.map(appointment => appointment.technician_rate);
        const average = technicianRatings.reduce((sum, rate) => sum + rate, 0) / technicianRatings.length;
        
        return { status: 200, average };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error calculating technician rating average." };
    }
};

module.exports = { getAppointmentsByUserId, addAppointment, getAllTechnicians, updateAppointmentPaid, deleteAppointment, updateAppointment, updateAppointmentRate, getUserRatingAverage, getTechnicianRatingAverage };
