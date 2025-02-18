const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/admin/profiles', authenticateToken, adminController.getUsers);
router.delete('/profiles/:id', authenticateToken, adminController.deleteUser);

module.exports = router;
