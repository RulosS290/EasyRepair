const express = require('express');
const authController = require('../controllers/controllersUsers');

const router = express.Router();

router.get('/login', authController.showLoginPage);
router.post('/login', authController.loginUser);

module.exports = router;
