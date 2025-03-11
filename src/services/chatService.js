const connection = require('../config/db');

async function getMessagesByAppointment(appointmentId) {
    try {
        console.log(`[INFO] Fetching messages for appointment ${appointmentId}`);

        const query = `
            SELECT am.id_message, am.message, am.created_at, 
                   u.username, u.type AS user_type
            FROM appointment_messages am
            JOIN users u ON am.sender_id = u.id
            WHERE am.id_appointment = ?
            ORDER BY am.created_at ASC
        `;

        console.log(`[DEBUG] Executing query: ${query} with appointmentId: ${appointmentId}`);
        
        const [messages] = await connection.query(query, [appointmentId]);

        if (messages.length === 0) {
            console.log(`[INFO] No messages found for appointment ${appointmentId}.`);
        } else {
            console.log(`[SUCCESS] Retrieved ${messages.length} messages for appointment ${appointmentId}.`);
        }

        return messages;
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve messages for appointment ${appointmentId}:`, error.message);
        throw error;
    }
}

async function createMessage({ appointmentId, userId, message }) {
    try {
        console.log(`[INFO] Creating message in appointment ${appointmentId} by user ${userId}`);
        console.log(`[DEBUG] Message content: ${message}`);

        if (!appointmentId || !userId || !message) {
            console.error(`[ERROR] Missing required fields. appointmentId: ${appointmentId}, userId: ${userId}, message: ${message}`);
            throw { status: 400, message: "Missing required fields" };
        }

        const query = `INSERT INTO appointment_messages (id_appointment, sender_id, message) VALUES (?, ?, ?)`;
        console.log(`[DEBUG] Executing query: ${query} with values: [${appointmentId}, ${userId}, ${message}]`);

        const [result] = await connection.query(query, [appointmentId, userId, message]);

        console.log(`[SUCCESS] Message created with ID: ${result.insertId} in appointment ${appointmentId}`);
        
        return { id: result.insertId, appointmentId, userId, message };
    } catch (error) {
        console.error(`[ERROR] Failed to insert message in appointment ${appointmentId}: ${error.message}`);
        throw { status: 500, message: "Error sending the message", error };
    }
}


module.exports = { getMessagesByAppointment, createMessage };
