const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  generateSchedule,
  getEventBlocks,
  commitEventBlocks,
  getWorkHours,
  updateWorkHours
} = require('./controller');

// Task routes
router.get('/tasks', auth, getTasks);
router.post('/tasks', auth, createTask);
router.get('/tasks/:id', auth, getTask);
router.patch('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

// Schedule routes
router.post('/schedule/plan', auth, generateSchedule);
router.get('/blocks', auth, getEventBlocks);
router.post('/blocks/commit', auth, commitEventBlocks);

// Work hours routes
router.get('/work-hours', auth, getWorkHours);
router.post('/work-hours', auth, updateWorkHours);

module.exports = router;