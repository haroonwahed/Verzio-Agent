const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { generateImage, editImage } = require('../controllers/imageController');

// Generate image
router.post('/generate', authenticate, generateImage);
// Edit image (background removal/upscaling)
router.post('/edit', authenticate, editImage);

module.exports = router;