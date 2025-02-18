const connection = require('../config/db');


const getAppointmentsByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        console.log('Consultando citas para el usuario con ID:', userId);

        // Consulta para obtener las citas donde el usuario es paciente o técnico
        const query = `SELECT * FROM appointments WHERE user_id = ? OR technician_id = ?`;
        connection.query(query, [userId, userId], async (err, appointments) => {
            if (err) return reject({ status: 500, message: 'Error al obtener las citas' });

            if (appointments.length === 0) {
                return reject({ status: 404, message: 'No hay citas encontradas' });
            }

            // Obtener los IDs de los técnicos y usuarios
            const userIds = [...new Set(appointments.flatMap(a => [a.user_id, a.technician_id]))];

            // Consulta para obtener los nombres de los usuarios
            const usersQuery = `SELECT id, username FROM users WHERE id IN (?)`;
            connection.query(usersQuery, [userIds], (err, users) => {
                if (err) return reject({ status: 500, message: 'Error al obtener los usuarios' });

                // Crear un diccionario para encontrar rápido los nombres por ID
                const usersMap = Object.fromEntries(users.map(u => [u.id, u.username]));

                // Construir la respuesta
                const results = appointments.map(a => {
                    const isTechnician = userId === a.technician_id;
                    
                    return {
                        id: a.id,
                        datetime: a.datetime,
                        device: a.device,
                        cost: a.cost,
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
        console.log('Iniciando la creación de la cita'); // Log inicial

        // Validación básica para los parámetros de entrada
        console.log('Verificando parámetros...');
        if (!userId || !technicianId || !datetime || !device || !cost) {
            console.log('Faltan datos:', { userId, technicianId, datetime, device, cost });
            return reject({ status: 400, message: 'Faltan datos necesarios para la cita' });
        }
        console.log('Todos los datos están presentes, continuando con la consulta del técnico...');
        
        // Primero, obtenemos el nombre del técnico utilizando el technicianId
        const technicianQuery = `SELECT id, username FROM users WHERE id = ? AND type = 'technical'`;
        console.log('Ejecutando consulta para obtener datos del técnico con technicianId:', technicianId);
        
        connection.query(technicianQuery, [technicianId], (err, technicianResults) => {
            if (err) {
                console.error('Error al obtener datos del técnico:', err);
                return reject({ status: 500, message: 'Error al obtener datos del técnico' });
            }
        
            if (technicianResults.length === 0) {
                console.log('No se encontró el técnico con ID:', technicianId);
                return reject({ status: 404, message: 'Técnico no encontrado' });
            }
        
            const technician = technicianResults[0]; // Obtener el primer (y único) técnico encontrado
            console.log('Técnico encontrado:', technician);
        
            // Ahora insertamos la cita en la tabla appointments con datetime
            const query = `INSERT INTO appointments (user_id, technician_id, datetime, device, cost) 
                           VALUES (?, ?, ?, ?, ?)`;

            console.log('Ejecutando la consulta para insertar la cita con los datos:', 
                [userId, technicianId, datetime, device, cost]);
        
            connection.query(query, [userId, technicianId, datetime, device, cost], (err, results) => {
                if (err) {
                    console.error('Error al insertar la cita:', err);
                    return reject({ status: 500, message: 'Error al agregar cita' });
                }
        
                console.log('Cita creada con éxito, resultados de la inserción:', results);
                resolve({ 
                    id: results.insertId, 
                    userId, 
                    technicianId, 
                    technicianName: technician.username, 
                    datetime, 
                    device, 
                    cost
                });
            });
        });
        
    });
};

// Obtener todos los técnicos
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
                   
module.exports = { getAppointmentsByUserId, addAppointment, getAllTechnicians };
