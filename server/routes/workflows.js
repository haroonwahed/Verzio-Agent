const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { saveWorkflowHandler, runWorkflowHandler } = require('../controllers/workflowsController');

// Save workflow definition
router.post('/save', authenticate, saveWorkflowHandler);
// Run a saved or ad‑hoc workflow
router.post('/run', authenticate, runWorkflowHandler);

module.exports = router;