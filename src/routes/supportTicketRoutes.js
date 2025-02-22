const express = require("express");
const router = express.Router();
const supportTicketController = require("../controllers/supportTicketController");
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');



router.post("/user/supportTicket", authenticateToken, supportTicketController.createSupportTicket);
router.get("/user/supportTicket", authenticateToken, isAdmin, supportTicketController.getAllSupportTickets);
router.get("/user/supportTicket/myTickets", authenticateToken, supportTicketController.getSupportTicketsByUser);

module.exports = router;
