
const plannerModel = require('./models');

// Simple greedy scheduler algorithm
const scheduleTasksIntoBlocks = (tasks, workHours, existingBlocks = []) => {
  const blocks = [];
  const MAX_BLOCK_MINUTES = 90;
  
  // Convert work hours to time slots for the week
  const workSlots = [];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start on Sunday
  
  for (let day = 0; day < 7; day++) {
    const dayWorkHours = workHours.filter(wh => wh.weekday === day);
    dayWorkHours.forEach(wh => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + day);
      
      const [startHour, startMin] = wh.start_time.split(':');
      const [endHour, endMin] = wh.end_time.split(':');
      
      const startTime = new Date(date);
      startTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0);
      
      workSlots.push({ start: startTime, end: endTime });
    });
  }
  
  // Sort tasks by priority: hard_deadline desc, priority desc, due_at asc
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.hard_deadline !== b.hard_deadline) return b.hard_deadline - a.hard_deadline;
    
    const priorityOrder = { high: 3, med: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    return new Date(a.due_at) - new Date(b.due_at);
  });
  
  // Schedule each task
  sortedTasks.forEach(task => {
    let remainingMinutes = task.est_minutes;
    
    while (remainingMinutes > 0) {
      const blockMinutes = Math.min(remainingMinutes, MAX_BLOCK_MINUTES);
      
      // Find next available slot
      let scheduled = false;
      for (const slot of workSlots) {
        if (isSlotAvailable(slot, blockMinutes, [...existingBlocks, ...blocks], task.due_at, task.hard_deadline)) {
          const blockEnd = new Date(slot.start.getTime() + blockMinutes * 60000);
          
          blocks.push({
            task_id: task.id,
            task_title: task.title,
            priority: task.priority,
            starts_at: slot.start.toISOString(),
            ends_at: blockEnd.toISOString(),
            source: 'auto'
          });
          
          // Update slot start time for next iteration
          slot.start = new Date(blockEnd.getTime() + 15 * 60000); // 15 min break
          remainingMinutes -= blockMinutes;
          scheduled = true;
          break;
        }
      }
      
      if (!scheduled) {
        // Can't schedule remaining time
        break;
      }
    }
  });
  
  return blocks;
};

const isSlotAvailable = (slot, durationMinutes, existingBlocks, dueDate, hardDeadline) => {
  const blockStart = slot.start;
  const blockEnd = new Date(blockStart.getTime() + durationMinutes * 60000);
  
  // Check if slot is long enough
  if (blockEnd > slot.end) return false;
  
  // Check hard deadline
  if (hardDeadline && dueDate && blockEnd > new Date(dueDate)) return false;
  
  // Check for conflicts with existing blocks
  const hasConflict = existingBlocks.some(existing => {
    const existingStart = new Date(existing.starts_at);
    const existingEnd = new Date(existing.ends_at);
    
    return (blockStart < existingEnd && blockEnd > existingStart);
  });
  
  return !hasConflict;
};

const createTask = async (req, res) => {
  try {
    const { title, notes, priority, est_minutes, due_at, hard_deadline, tags } = req.body;
    const result = plannerModel.createTask(title, notes, priority, est_minutes, due_at, hard_deadline, tags);
    res.json({ id: result.lastInsertRowid, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = plannerModel.getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    plannerModel.updateTask(id, updates);
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const planSchedule = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default user for demo
    
    // Get tasks that need scheduling (not done/blocked)
    const allTasks = plannerModel.getTasks();
    const tasksToSchedule = allTasks.filter(t => ['todo', 'doing'].includes(t.status));
    
    // Get work hours
    const workHours = plannerModel.getWorkHours(userId);
    
    // Get existing blocks for the week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const existingBlocks = plannerModel.getEventBlocks(
      startOfWeek.toISOString(),
      endOfWeek.toISOString()
    );
    
    // Generate schedule
    const proposedBlocks = scheduleTasksIntoBlocks(tasksToSchedule, workHours, existingBlocks);
    
    res.json({ proposed_blocks: proposedBlocks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const commitBlocks = async (req, res) => {
  try {
    const { blocks } = req.body;
    
    // Clear existing auto-generated blocks for these tasks
    const taskIds = [...new Set(blocks.map(b => b.task_id))];
    taskIds.forEach(taskId => {
      plannerModel.deleteEventBlocks(taskId);
    });
    
    // Create new blocks
    blocks.forEach(block => {
      plannerModel.createEventBlock(
        block.task_id,
        block.starts_at,
        block.ends_at,
        'auto'
      );
    });
    
    res.json({ message: 'Schedule committed successfully', blocks_created: blocks.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlocks = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const blocks = plannerModel.getEventBlocks(start_date, end_date);
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const syncCalendars = async (req, res) => {
  try {
    // Stub implementation - no external API calls
    res.json({ synced: false, message: 'Calendar sync not configured' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  planSchedule,
  commitBlocks,
  getBlocks,
  syncCalendars
};
