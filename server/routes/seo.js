const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { analyzeSEO } = require('../controllers/seoController');

router.post('/analyze', authenticate, analyzeSEO);

module.exports = router;