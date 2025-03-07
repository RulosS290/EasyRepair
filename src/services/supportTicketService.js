const connection = require('../config/db');

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

async function createSupportTicket({ userId, type, description }) {
    try {
        console.log(`[INFO] Creating ticket for user ID: ${userId} with type: ${type}`);

        const query = `INSERT INTO support_tickets (id_user, type, description) VALUES (?, ?, ?)`;
        const [results] = await connection.query(query, [userId, type, description]);

        console.log(`[DEBUG] Query result:`, results);

        if (!results || !results.insertId) {
            console.error(`[ERROR] No insertId generated, possible insertion failure.`);
            throw { status: 500, message: 'Failed to create support ticket' };
        }

        console.log(`[SUCCESS] Ticket created with ID: ${results.insertId}`);
        return { id: results.insertId, userId, type, description, state: true };
    } catch (error) {
        console.error(`[ERROR] Error inserting the ticket: ${error.message}`);
        throw { status: 500, message: 'Failed to create the support ticket', error };
    }
}

async function getAllSupportTickets() {
    try {
        console.log(`[INFO] Requesting all support tickets`);

        const query = `SELECT id_ticket, id_user, type, state, description, created_at FROM support_tickets`;
        const [results] = await connection.query(query);

        console.log(`[DEBUG] Query result (All Tickets):`, results);

        if (!results || results.length === 0) {
            console.warn(`[WARNING] No tickets found in the database.`);
            return [];
        }

        console.log(`[SUCCESS] ${results.length} tickets found`);
        return results;
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve tickets: ${error.message}`);
        throw { status: 500, message: 'Error retrieving support tickets', error };
    }
}

async function getSupportTicketsByUser(userId) {
    try {
        console.log(`[INFO] Requesting tickets for user ID: ${userId}`);

        const query = `SELECT id_ticket, id_user, type, state, description, created_at FROM support_tickets WHERE id_user = ?`;
        const [results] = await connection.query(query, [userId]);

        console.log(`[DEBUG] Query result (User Tickets):`, results);

        if (!results || results.length === 0) {
            console.warn(`[WARNING] No tickets found for user ${userId}.`);
            return [];
        }

        console.log(`[SUCCESS] ${results.length} tickets found for user ${userId}.`);
        return results;
    } catch (error) {
        console.error(`[ERROR] Error retrieving tickets for user ${userId}: ${error.message}`);
        throw { status: 500, message: 'Error retrieving user tickets', error };
    }
}

module.exports = { getAllSupportTickets, createSupportTicket, getSupportTicketsByUser, createMessage };