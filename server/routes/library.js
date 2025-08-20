
const express = require('express');
const { getLibraryItems, deleteLibraryItem, saveToLibrary } = require('../controllers/libraryController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/items', authenticateToken, getLibraryItems);
router.delete('/items/:id', authenticateToken, deleteLibraryItem);
router.post('/save', authenticateToken, saveToLibrary);

module.exports = router;
