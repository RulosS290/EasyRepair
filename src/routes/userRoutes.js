const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users', authenticateToken, userController.getUserInfo);

module.exports = router;
