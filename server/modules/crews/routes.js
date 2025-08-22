
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getCrews,
  createCrew,
  getCrewTemplates,
  runCrew,
  getCrewDrafts
} = require('./controller');

// Crew routes
router.get('/', auth, getCrews);
router.post('/', auth, createCrew);
router.get('/templates', auth, getCrewTemplates);
router.post('/:id/run', auth, runCrew);
router.get('/:id/drafts', auth, getCrewDrafts);

module.exports = router;
