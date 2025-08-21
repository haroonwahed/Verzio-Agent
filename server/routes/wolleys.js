const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  listWolleys,
  create,
  update,
  remove,
  chat,
  getChatHistoryForWolley,
  clearChatHistoryForWolley,
} = require('../controllers/wolleysController');

// All routes require authentication
router.get('/', authenticate, listWolleys);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.post('/chat', authenticate, chat);
router.get('/:wolleyId/history', authenticate, getChatHistoryForWolley);
router.delete('/:wolleyId/history', authenticate, clearChatHistoryForWolley);

module.exports = router;