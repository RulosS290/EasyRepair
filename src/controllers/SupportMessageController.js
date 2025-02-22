const supportMessageService = require("../services/supportMessageService");

async function getMessagesByTicket(req, res) {
    const { ticketId } = req.params;
    const { id: userId, type: userType } = req.user;

    try {
        const messages = await supportMessageService.getMessagesByTicket(ticketId, userId, userType);
        res.status(200).json(messages);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}

async function createMessage(req, res) {
    const { ticketId } = req.params;
    const { message } = req.body;
    const { id: userId } = req.user;

    if (!message) {
        return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    try {
        const newMessage = await supportMessageService.createMessage({ ticketId, userId, message });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getMessagesByTicket, createMessage };