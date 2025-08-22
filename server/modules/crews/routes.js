
const express = require('express');
const router = express.Router();
const crewsController = require('./controller');
const auth = require('../../middleware/auth');

// Feature flag check middleware
const checkCrewsFeature = (req, res, next) => {
  if (process.env.FEATURE_CREWS !== 'true') {
    return res.status(404).json({ error: 'Feature not enabled' });
  }
  next();
};

// Apply feature flag to all routes
router.use(checkCrewsFeature);

// Template routes
router.post('/templates', auth, crewsController.createTemplate);
router.get('/templates', auth, crewsController.getTemplates);

// Crew routes
router.post('/', auth, crewsController.createCrew);
router.get('/', auth, crewsController.getCrews);
router.post('/:id/run', auth, crewsController.runCrew);
router.get('/:id/drafts', auth, crewsController.getCrewDrafts);

module.exports = router;
