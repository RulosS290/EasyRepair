const path = require('path');
const connection = require('../config/db');

// Mostrar el formulario de agendamiento
const showAppointmentsForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'createAppointments.html'));
};

// Agendar una nueva cita
const createAppointment = (req, res) => {
    const { user_id, date, time, technician_name, device } = req.body;

    if (!user_id || !date || !time || !technician_name || !device) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    connection.query(
        'INSERT INTO appointments (user_id, date, time, technician_name, device) VALUES (?, ?, ?, ?, ?)',
        [user_id, date, time, technician_name, device],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al registrar la cita');
            }
            res.send('Cita agendada con éxito');
        }
    );
};

// Obtener citas de un usuario específico
const getAppointmentsByUser = (req, res) => {
    const { user_id } = req.params;

    connection.query(
        'SELECT * FROM appointments WHERE user_id = ?',
        [user_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al obtener citas');
            }
            res.json(results);
        }
    );
};

// Obtener la lista de técnicos
const getTechnicians = (req, res) => {
    connection.query(
        'SELECT username FROM users WHERE type = "technical"', // Filtra solo técnicos
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al obtener técnicos');
            }
            res.json(results);
        }
    );
};

module.exports = { showAppointmentsForm, createAppointment, getAppointmentsByUser, getTechnicians };