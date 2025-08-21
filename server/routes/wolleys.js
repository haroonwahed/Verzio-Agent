const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  listWolleys,
  create,
  update,
  remove,
  chat,
} = require('../controllers/wolleysController');

// All routes require authentication
router.get('/', authenticate, listWolleys);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.post('/chat', authenticate, chat);

module.exports = router;