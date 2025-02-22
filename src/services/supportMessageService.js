const connection = require('../config/db');

async function getMessagesByTicket(ticketId, userId, userType) {
    try {
        const [ticket] = await connection.query(
            "SELECT id_user FROM support_tickets WHERE id_ticket = ?",
            [ticketId]
        );

        if (!ticket || ticket.length === 0) {
            throw new Error("Ticket no encontrado.");
        }

        if (userType !== "admin" && ticket[0].id_user !== userId) {
            throw new Error("No tienes permisos para ver este ticket.");
        }

        const [messages] = await connection.query(
            `SELECT sm.id_message, sm.message, sm.created_at, 
                    u.username, u.type AS user_type
             FROM support_messages sm
             JOIN users u ON sm.sender_id = u.id
             WHERE sm.id_ticket = ?
             ORDER BY sm.created_at ASC`,
            [ticketId]
        );

        return messages;
    } catch (error) {
        console.error(`[ERROR] No se pudieron obtener los mensajes del ticket ${ticketId}:`, error.message);
        throw error;
    }
}

async function createMessage({ ticketId, userId, message }) {
    try {
        console.log(`[INFO] Creando mensaje en ticket ${ticketId} por usuario ${userId}`);

        const query = `INSERT INTO support_messages (id_ticket, sender_id, message) VALUES (?, ?, ?)`;
        const [result] = await connection.query(query, [ticketId, userId, message]);

        console.log(`[SUCCESS] Mensaje creado con ID: ${result.insertId}`);
        return { id: result.insertId, ticketId, userId, message };
    } catch (error) {
        console.error(`[ERROR] No se pudo insertar el mensaje: ${error.message}`);
        throw { status: 500, message: "Error al enviar el mensaje", error };
    }
}

module.exports = { getMessagesByTicket, createMessage };

