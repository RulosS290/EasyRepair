const connection = require('../config/db');

async function createSupportTicket({ userId, type, description }) {
    try {
        console.log(`[INFO] Creando ticket para usuario ID: ${userId} con tipo: ${type}`);

        const query = `INSERT INTO support_tickets (id_user, type, description) VALUES (?, ?, ?)`;
        const [results] = await connection.query(query, [userId, type, description]);

        console.log(`[DEBUG] Resultado de la consulta:`, results);

        if (!results || !results.insertId) {
            console.error(`[ERROR] No se generó un insertId, posible fallo en la inserción`);
            throw { status: 500, message: 'No se pudo crear el ticket de soporte' };
        }

        console.log(`[SUCCESS] Ticket creado con ID: ${results.insertId}`);
        return { id: results.insertId, userId, type, description, state: true };
    } catch (error) {
        console.error(`[ERROR] Error al insertar el ticket: ${error.message}`);
        throw { status: 500, message: 'Error al crear el ticket de soporte', error };
    }
}

async function getAllSupportTickets() {
    try {
        console.log(`[INFO] Solicitando todos los tickets de soporte`);

        const query = `SELECT id_ticket, id_user, type, state, description, created_at FROM support_tickets`;
        const [results] = await connection.query(query);

        console.log(`[DEBUG] Resultado de la consulta (All Tickets):`, results);

        if (!results || results.length === 0) {
            console.warn(`[WARNING] No se encontraron tickets en la base de datos.`);
            return [];
        }

        console.log(`[SUCCESS] ${results.length} tickets encontrados`);
        return results;
    } catch (error) {
        console.error(`[ERROR] Error al obtener los tickets: ${error.message}`);
        throw { status: 500, message: 'Error al obtener los tickets de soporte', error };
    }
}

async function getSupportTicketsByUser(userId) {
    try {
        console.log(`[INFO] Solicitando tickets para el usuario ID: ${userId}`);

        const query = `SELECT id_ticket, id_user, type, state, description, created_at FROM support_tickets WHERE id_user = ?`;
        const [results] = await connection.query(query, [userId]);

        console.log(`[DEBUG] Resultado de la consulta (User Tickets):`, results);

        if (!results || results.length === 0) {
            console.warn(`[WARNING] No se encontraron tickets para el usuario ${userId}.`);
            return [];
        }

        console.log(`[SUCCESS] ${results.length} tickets encontrados para el usuario ${userId}`);
        return results;
    } catch (error) {
        console.error(`[ERROR] Error al obtener los tickets del usuario ${userId}: ${error.message}`);
        throw { status: 500, message: 'Error al obtener los tickets del usuario', error };
    }
}

module.exports = { getAllSupportTickets, createSupportTicket, getSupportTicketsByUser };
