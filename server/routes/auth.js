
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { signup, login, getMe, changePassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
