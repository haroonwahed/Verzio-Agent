
const express = require('express');
const { chatMessage } = require('../controllers/chatController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/message', authenticateToken, chatMessage);

module.exports = router;
