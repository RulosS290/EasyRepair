const connection = require('../config/db');

const getAppointmentsByUserId = async (userId) => {
    try {
        const [appointments] = await connection.query(
            `SELECT * FROM appointments WHERE user_id = ? OR technician_id = ?`,
            [userId, userId]
        );
        
        if (appointments.length === 0) {
            throw { status: 404, message: 'No hay citas encontradas' };
        }
        
        const userIds = [...new Set(appointments.flatMap(a => [a.user_id, a.technician_id]))];
        const [users] = await connection.query(
            `SELECT id, username FROM users WHERE id IN (?)`,
            [userIds]
        );
        
        const usersMap = Object.fromEntries(users.map(u => [u.id, u.username]));
        
        return appointments.map(a => ({
            id: a.id,
            datetime: a.datetime,
            device: a.device,
            cost: a.cost,
            paid: a.paid === 1,
            related_user_name: userId === a.technician_id ? usersMap[a.user_id] : usersMap[a.technician_id]
        }));
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al obtener las citas' };
    }
};

const addAppointment = async (userId, technicianId, datetime, device, cost = 1) => {
    try {
        if (!userId || !technicianId || !datetime || !device || !cost) {
            throw { status: 400, message: 'Faltan datos necesarios para la cita' };
        }
        
        technicianId = Number(technicianId);
        datetime = new Date(datetime);
        
        const [technicianResults] = await connection.query(
            `SELECT id, username FROM users WHERE id = ? AND type = 'technical'`,
            [technicianId]
        );
        
        if (technicianResults.length === 0) {
            throw { status: 404, message: 'Técnico no encontrado' };
        }
        
        const technician = technicianResults[0];
        
        const [results] = await connection.query(
            `INSERT INTO appointments (user_id, technician_id, datetime, device, cost, paid) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, technicianId, datetime, device, cost, 0]
        );
        
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
            throw { status: 400, message: 'La cita ya está pagada o no existe' };
        }
        
        return { status: 200, message: 'Pago registrado correctamente' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al actualizar el pago' };
    }
};

const updateAppointmentRate = async (appointmentId, rate) => {
    try {
        const [appointment] = await connection.query(
            `SELECT technician_rate, user_rate FROM appointments WHERE id = ?`,
            [appointmentId]
        );

        if (appointment.length === 0) {
            throw { status: 400, message: 'La cita no existe' };
        }

        let fieldToUpdate;

        if (appointment[0].technician_rate === null) {
            fieldToUpdate = 'technician_rate';
        } else if (appointment[0].user_rate === null) {
            fieldToUpdate = 'user_rate';
        } else {
            throw { status: 400, message: 'La cita ya ha sido calificada completamente' };
        }

        const [results] = await connection.query(
            `UPDATE appointments SET ${fieldToUpdate} = ? WHERE id = ?`,
            [rate, appointmentId]
        );

        if (results.affectedRows === 0) {
            throw { status: 400, message: 'No se pudo actualizar la calificación' };
        }

        return { status: 200, message: 'Calificación registrada correctamente' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al actualizar la calificación' };
    }
};

const getAllTechnicians = async () => {
    try {
        const [results] = await connection.query(
            `SELECT id, username FROM users WHERE type = 'technical'`
        );
        
        if (results.length === 0) {
            throw { status: 404, message: 'No se encontraron técnicos' };
        }
        
        return results;
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al obtener los técnicos' };
    }
};

const deleteAppointment = async (appointmentId) => {
    try {
        const [results] = await connection.query(
            `DELETE FROM appointments WHERE id = ?`,
            [appointmentId]
        );
        
        if (results.affectedRows === 0) {
            throw { status: 404, message: 'Cita no encontrada' };
        }
        
        return { status: 200, message: 'Cita eliminada exitosamente' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error en el servidor' };
    }
};

const updateAppointment = async (appointmentId, datetime, device, paid) => {
    try {
        const [results] = await connection.query(
            `UPDATE appointments SET datetime = ?, device = ?, paid = ? WHERE id = ?`,
            [datetime, device, paid, appointmentId]
        );
        
        if (results.affectedRows === 0) {
            throw { status: 404, message: 'Cita no encontrada' };
        }
        
        return { status: 200, message: 'Cita actualizada correctamente' };
    } catch (error) {
        throw error.status ? error : { status: 500, message: 'Error al actualizar la cita' };
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
