const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/admin/profiles', authenticateToken, isAdmin, adminController.getUsers);
router.delete('/admin/profiles/:id', authenticateToken, isAdmin, adminController.deleteUser);

module.exports = router;
