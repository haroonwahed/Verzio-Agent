
const express = require('express');
const { chatMessage } = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/message', authenticate, chatMessage);

module.exports = router;
