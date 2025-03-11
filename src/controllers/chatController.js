const appointmentMessageService = require("../services/chatService");

async function getMessagesByAppointment(req, res) {
    const { appointmentId } = req.params;

    console.log(`[INFO] Requested messages for Appointment ID: ${appointmentId}`);

    try {
        const messages = await appointmentMessageService.getMessagesByAppointment(appointmentId);
        console.log(`[SUCCESS] Retrieved ${messages.length} messages for Appointment ID: ${appointmentId}`);
        res.status(200).json(messages);
    } catch (error) {
        console.error(`[ERROR] Failed to retrieve messages for Appointment ID: ${appointmentId}: ${error.message}`);
        res.status(403).json({ error: error.message });
    }
}

async function createMessage(req, res) {
    const { appointmentId } = req.params;
    const { message } = req.body;
    const { id: userId } = req.user;

    console.log(`[INFO] User ID: ${userId} is creating a message for Appointment ID: ${appointmentId}`);

    if (!message) {
        console.warn(`[WARNING] Empty message attempt by User ID: ${userId} for Appointment ID: ${appointmentId}`);
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        const newMessage = await appointmentMessageService.createMessage({ appointmentId, userId, message });
        console.log(`[SUCCESS] Message created successfully for Appointment ID: ${appointmentId} by User ID: ${userId}`);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(`[ERROR] Failed to create message for Appointment ID: ${appointmentId} by User ID: ${userId}: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getMessagesByAppointment, createMessage };
