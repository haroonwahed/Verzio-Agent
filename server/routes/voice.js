const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { synthesizeVoice } = require('../controllers/voiceController');

router.post('/synthesize', authenticate, synthesizeVoice);

module.exports = router;