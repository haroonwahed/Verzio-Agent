const express = require('express');
const { getLibraryItems, deleteLibraryItem, saveToLibrary } = require('../controllers/libraryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/items', authenticate, getLibraryItems);
router.delete('/items/:id', authenticate, deleteLibraryItem);
router.post('/save', authenticate, saveToLibrary);

module.exports = router;