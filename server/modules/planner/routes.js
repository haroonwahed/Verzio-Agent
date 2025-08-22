
const express = require('express');
const router = express.Router();
const plannerController = require('./controller');
const auth = require('../../middleware/auth');

// Feature flag check middleware
const checkPlannerFeature = (req, res, next) => {
  if (process.env.FEATURE_PLANNER !== 'true') {
    return res.status(404).json({ error: 'Feature not enabled' });
  }
  next();
};

// Apply feature flag to all routes
router.use(checkPlannerFeature);

// Task routes
router.post('/tasks', auth, plannerController.createTask);
router.get('/tasks', auth, plannerController.getTasks);
router.patch('/tasks/:id', auth, plannerController.updateTask);

// Scheduler routes
router.post('/scheduler/plan', auth, plannerController.planSchedule);
router.post('/blocks/commit', auth, plannerController.commitBlocks);
router.get('/blocks', auth, plannerController.getBlocks);

// Calendar routes
router.post('/calendars/sync', auth, plannerController.syncCalendars);

module.exports = router;
