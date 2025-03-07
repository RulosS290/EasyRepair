const connection = require('../config/db');

async function getMessagesByTicket(ticketId, userId, userType) {
    try {
        console.log(`[INFO] Fetching messages for ticket ${ticketId} by user ${userId}`);
        const [ticket] = await connection.query(
            "SELECT id_user FROM support_tickets WHERE id_ticket = ?",
            [ticketId]
        );

        if (!ticket || ticket.length === 0) {
            console.log(`[WARNING] Ticket ${ticketId} not found.`);
            throw new Error("Ticket not found.");            
        }

        if (userType !== "admin" && ticket[0].id_user !== userId) {
            console.log(`[WARNING] User ${userId} does not have permission to view ticket ${ticketId}.`);
            throw new Error("You do not have permission to view this ticket.");
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

        console.log(`[SUCCESS] Messages retrieved for ticket ${ticketId}.`);
        return messages;
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve messages for ticket ${ticketId}:`, error.message);
        throw error;
    }
}

async function createMessage({ ticketId, userId, message }) {
    try {
        console.log(`[INFO] Creating message in ticket ${ticketId} by user ${userId}`);

        const query = `INSERT INTO support_messages (id_ticket, sender_id, message) VALUES (?, ?, ?)`;
        const [result] = await connection.query(query, [ticketId, userId, message]);

        console.log(`[SUCCESS] Message created with ID: ${result.insertId} in ticket ${ticketId}`);
        return { id: result.insertId, ticketId, userId, message };
    } catch (error) {
        console.error(`[ERROR] Failed to insert message in ticket ${ticketId}: ${error.message}`);
        throw { status: 500, message: "Error sending the message", error };
    }
}

module.exports = { getMessagesByTicket, createMessage };
