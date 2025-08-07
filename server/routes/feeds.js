const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { generateFeeds } = require('../controllers/feedsController');

// Generate product descriptions in bulk
router.post('/generate', authenticate, generateFeeds);

module.exports = router;