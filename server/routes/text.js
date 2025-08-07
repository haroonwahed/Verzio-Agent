const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { generateText } = require('../controllers/textController');

// Protected route for text generation
router.post('/generate', authenticate, generateText);

module.exports = router;