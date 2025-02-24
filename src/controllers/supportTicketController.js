const supportTicketService = require("../services/supportTicketService");

async function createSupportTicket(req, res) {
    const userId = req.user.id; // Get the authenticated user's ID
    const { type, description } = req.body;

    console.log(`[INFO] Creating support ticket for user ID: ${userId} with type: ${type}`);

    if (!userId || !type || !description) {
        console.warn(`[WARNING] Missing fields when creating a support ticket for user ID: ${userId}`);
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newTicket = await supportTicketService.createSupportTicket({ userId, type, description });
        console.log(`[SUCCESS] Ticket successfully created for user ID: ${userId}, Ticket ID: ${newTicket.id}`);
        res.status(201).json(newTicket);
    } catch (error) {
        console.error(`[ERROR] Error creating support ticket for user ID: ${userId}: ${error.message}`);
        res.status(500).json({ message: "Error creating support ticket", error: error.message });
    }
}

async function getAllSupportTickets(req, res) {
    if (req.user.type !== "admin") {
        console.warn(`[WARNING] Access denied. User ID: ${req.user.id} is not an administrator.`);
        return res.status(403).json({ message: "Access denied" });
    }

    console.log(`[INFO] Admin user ID: ${req.user.id} requested all support tickets`);

    try {
        const tickets = await supportTicketService.getAllSupportTickets();
        console.log(`[SUCCESS] Found ${tickets.length} support tickets`);
        res.status(200).json(tickets);
    } catch (error) {
        console.error(`[ERROR] Error retrieving support tickets: ${error.message}`);
        res.status(500).json({ message: "Error retrieving support tickets", error: error.message });
    }
}

async function getSupportTicketsByUser(req, res) {
    const userId = req.user.id;

    console.log(`[INFO] User ID: ${userId} requested their support tickets`);

    try {
        const tickets = await supportTicketService.getSupportTicketsByUser(userId);
        console.log(`[SUCCESS] Found ${tickets.length} support tickets for user ID: ${userId}`);
        res.status(200).json(tickets);
    } catch (error) {
        console.error(`[ERROR] Error retrieving support tickets for user ID: ${userId}: ${error.message}`);
        res.status(500).json({ message: "Error retrieving support tickets", error: error.message });
    }
}

async function getMessagesByTicket(req, res) {
    const { ticketId } = req.params;
    const { id: userId, type: userType } = req.user;

    console.log(`[INFO] User ID: ${userId} (Type: ${userType}) requested messages for Ticket ID: ${ticketId}`);

    try {
        const messages = await supportMessageService.getMessagesByTicket(ticketId, userId, userType);
        console.log(`[SUCCESS] Retrieved ${messages.length} messages for Ticket ID: ${ticketId}`);
        res.status(200).json(messages);
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve messages for Ticket ID: ${ticketId}, User ID: ${userId}: ${error.message}`);
        res.status(403).json({ error: error.message });
    }
}


module.exports = { createSupportTicket, getAllSupportTickets, getSupportTicketsByUser, getMessagesByTicket };
