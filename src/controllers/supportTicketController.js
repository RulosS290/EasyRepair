const supportTicketService = require("../services/supportTicketService");

async function createSupportTicket(req, res) {
    const userId = req.user.id; // Obtener el ID del usuario autenticado
    const { type, description } = req.body;

    console.log(`[INFO] Creando ticket para usuario ID: ${userId} con tipo: ${type}`);

    if (!userId || !type || !description) {
        console.warn(`[WARNING] Campos faltantes al crear un ticket para el usuario ID: ${userId}`);
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        const newTicket = await supportTicketService.createSupportTicket({ userId, type, description });
        console.log(`[SUCCESS] Ticket creado correctamente para usuario ID: ${userId}, ID del ticket: ${newTicket.id}`);
        res.status(201).json(newTicket);
    } catch (error) {
        console.error(`[ERROR] Error al crear el ticket para usuario ID: ${userId}: ${error.message}`);
        res.status(500).json({ message: "Error al crear el ticket", error: error.message });
    }
}

async function getAllSupportTickets(req, res) {
    if (req.user.type !== "admin") {
        console.warn(`[WARNING] Acceso denegado. El usuario ID: ${req.user.id} no es administrador.`);
        return res.status(403).json({ message: "Acceso denegado" });
    }

    console.log(`[INFO] Usuario admin ID: ${req.user.id} solicitó todos los tickets de soporte`);

    try {
        const tickets = await supportTicketService.getAllSupportTickets();
        console.log(`[SUCCESS] ${tickets.length} tickets encontrados`);
        res.status(200).json(tickets);
    } catch (error) {
        console.error(`[ERROR] Error al obtener los tickets: ${error.message}`);
        res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
    }
}

async function getSupportTicketsByUser(req, res) {
    const userId = req.user.id;

    console.log(`[INFO] Usuario ID: ${userId} solicitó sus tickets de soporte`);

    try {
        const tickets = await supportTicketService.getSupportTicketsByUser(userId);
        console.log(`[SUCCESS] ${tickets.length} tickets encontrados para el usuario ID: ${userId}`);
        res.status(200).json(tickets);
    } catch (error) {
        console.error(`[ERROR] Error al obtener los tickets del usuario ID: ${userId}: ${error.message}`);
        res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
    }
}

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

module.exports = { createSupportTicket, getAllSupportTickets, getSupportTicketsByUser };
