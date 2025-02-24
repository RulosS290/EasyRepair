const supportMessageService = require("../services/supportMessageService");

async function getMessagesByTicket(req, res) {
    const { ticketId } = req.params;
    const { id: userId, type: userType } = req.user;

    console.log(`[INFO] User ID: ${userId} requested messages for Ticket ID: ${ticketId}`);

    try {
        const messages = await supportMessageService.getMessagesByTicket(ticketId, userId, userType);
        console.log(`[SUCCESS] Retrieved ${messages.length} messages for Ticket ID: ${ticketId}`);
        res.status(200).json(messages);
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve messages for Ticket ID: ${ticketId}: ${error.message}`);
        res.status(403).json({ error: error.message });
    }
}

async function createMessage(req, res) {
    const { ticketId } = req.params;
    const { message } = req.body;
    const { id: userId } = req.user;

    console.log(`[INFO] User ID: ${userId} is creating a message for Ticket ID: ${ticketId}`);

    if (!message) {
        console.warn(`[WARNING] Empty message attempt by User ID: ${userId} for Ticket ID: ${ticketId}`);
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        const newMessage = await supportMessageService.createMessage({ ticketId, userId, message });
        console.log(`[SUCCESS] Message created successfully for Ticket ID: ${ticketId} by User ID: ${userId}`);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(`[ERROR] Failed to create message for Ticket ID: ${ticketId} by User ID: ${userId}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getMessagesByTicket, createMessage };
