const connection = require('../config/db');


const getAppointmentsByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM appointments WHERE user_id = ? OR technician_id = ?`;
        
        connection.query(query, [userId, userId], async (err, appointments) => {
            if (err) return reject({ status: 500, message: 'Error al obtener las citas' });

            if (appointments.length === 0) {
                return reject({ status: 404, message: 'No hay citas encontradas' });
            }

            const userIds = [...new Set(appointments.flatMap(a => [a.user_id, a.technician_id]))];

            const usersQuery = `SELECT id, username FROM users WHERE id IN (?)`;
            connection.query(usersQuery, [userIds], (err, users) => {
                if (err) return reject({ status: 500, message: 'Error al obtener los usuarios' });

                const usersMap = Object.fromEntries(users.map(u => [u.id, u.username]));

                const results = appointments.map(a => {
                    const isTechnician = userId === a.technician_id;
                    
                    return {
                        id: a.id,
                        datetime: a.datetime,
                        device: a.device,
                        cost: a.cost,
                        paid: a.paid === 1, 
                        related_user_name: isTechnician ? usersMap[a.user_id] : usersMap[a.technician_id]
                    };
                });

                resolve(results);
            });
        });
    });
};


const addAppointment = async (userId, technicianId, datetime, device, cost = 1) => {
    technicianId = typeof technicianId === 'string' ? parseInt(technicianId) : technicianId;
    datetime = typeof datetime === 'string' ? new Date(datetime) : datetime;
    datetime = datetime instanceof Date ? datetime : new Date(datetime);
    
    return new Promise((resolve, reject) => {
        if (!userId || !technicianId || !datetime || !device || !cost) {
            return reject({ status: 400, message: 'Faltan datos necesarios para la cita' });
        }
        
        const technicianQuery = `SELECT id, username FROM users WHERE id = ? AND type = 'technical'`;
        
        connection.query(technicianQuery, [technicianId], (err, technicianResults) => {
            if (err) {
                console.error('Error al obtener datos del técnico:', err);
                return reject({ status: 500, message: 'Error al obtener datos del técnico' });
            }
        
            if (technicianResults.length === 0) {
                return reject({ status: 404, message: 'Técnico no encontrado' });
            }
        
            const technician = technicianResults[0]; 
        
            const query = `INSERT INTO appointments (user_id, technician_id, datetime, device, cost, paid) 
                           VALUES (?, ?, ?, ?, ?, ?)`;
            connection.query(query, [userId, technicianId, datetime, device, cost, 0], (err, results) => {
                if (err) {
                    console.error('Error al insertar la cita:', err);
                    return reject({ status: 500, message: 'Error al agregar cita' });
                }
    
                resolve({ 
                    id: results.insertId, 
                    userId, 
                    technicianId, 
                    technicianName: technician.username, 
                    datetime, 
                    device, 
                    cost, 
                    paid: 0 
                });
            });
        });
    });
};

const updateAppointmentPaid = (appointmentId) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE appointments SET paid = 1 WHERE id = ? AND paid = 0`;

        connection.query(query, [appointmentId], (err, results) => {
            if (err) {
                console.error('Error al actualizar el pago:', err);
                return reject({ status: 500, message: 'Error al actualizar el pago' });
            }

            if (results.affectedRows === 0) {
                return reject({ status: 400, message: 'La cita ya está pagada o no existe' });
            }

            resolve({ status: 200, message: 'Pago registrado correctamente' });
        });
    });
};

const getAllTechnicians = async () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT id, username FROM users WHERE type = 'technical'`;

        connection.query(query, (err, results) => {
            if (err) return reject({ status: 500, message: 'Error al obtener los técnicos' });
            if (results.length === 0) return reject({ status: 404, message: 'No se encontraron técnicos' });
            resolve(results);
        });
    });
};

const deleteAppointment = (appointmentId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM appointments WHERE id = ?`;
        connection.query(query, [appointmentId], (err, results) => {
            if (err) {
                console.error('Error al eliminar la cita:', err);
                return reject({ status: 500, message: 'Error en el servidor' });
            }
            if (results.affectedRows === 0) {
                return reject({ status: 404, message: 'Cita no encontrada' });
            }
            resolve({ status: 200, message: 'Cita eliminada exitosamente' });
        });
    });
};

const updateAppointment = async (appointmentId, datetime, device, paid) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE appointments SET datetime = ?, device = ?, paid = ? WHERE id = ?`;
        connection.query(query, [datetime, device, paid, appointmentId], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                return reject({ status: 500, message: 'Error al actualizar la cita' });
            }
            if (result.affectedRows === 0) {
                return reject({ status: 404, message: 'Cita no encontrada' });
            }
            resolve({ status: 200, message: 'Cita actualizada correctamente' });
        });
    });
};


module.exports = { getAppointmentsByUserId, addAppointment, getAllTechnicians, updateAppointmentPaid, deleteAppointment, updateAppointment };
