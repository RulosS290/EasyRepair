const express = require("express");
const router = express.Router();
const supportMessageController = require("../controllers/SupportMessageController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/supportTicket/:ticketId/messages", authenticateToken, supportMessageController.getMessagesByTicket);

router.post("/supportTicket/:ticketId/messages", authenticateToken, supportMessageController.createMessage);

module.exports = router;
