const plannerModel = require('./models');
const { getDb } = require('../../db');

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

const getTasks = (req, res) => {
  try {
    const db = getDb();
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = (req, res) => {
  try {
    const { title, notes, priority, est_minutes, due_at, hard_deadline, status, tags } = req.body;
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO tasks (title, notes, priority, est_minutes, due_at, hard_deadline, status, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, notes, priority || 'med', est_minutes || 60, due_at, hard_deadline || 0, status || 'todo', tags);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTask = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, notes, priority, est_minutes, due_at, hard_deadline, status, tags } = req.body;
    const db = getDb();

    // Build dynamic update query
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }
    if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
    if (est_minutes !== undefined) { fields.push('est_minutes = ?'); values.push(est_minutes); }
    if (due_at !== undefined) { fields.push('due_at = ?'); values.push(due_at); }
    if (hard_deadline !== undefined) { fields.push('hard_deadline = ?'); values.push(hard_deadline); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (tags !== undefined) { fields.push('tags = ?'); values.push(tags); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

const generateSchedule = (req, res) => {
  try {
    const db = getDb();

    // Get unscheduled tasks
    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE status != 'done' 
      AND id NOT IN (SELECT DISTINCT task_id FROM event_blocks WHERE task_id IS NOT NULL)
      ORDER BY 
        hard_deadline DESC,
        CASE priority WHEN 'high' THEN 3 WHEN 'med' THEN 2 ELSE 1 END DESC,
        due_at ASC
    `).all();

    // Simple scheduling algorithm
    const eventBlocks = [];
    const startDate = new Date();
    startDate.setHours(9, 0, 0, 0); // Start at 9 AM

    let currentTime = new Date(startDate);

    for (const task of tasks) {
      // Skip weekends (simple implementation)
      while (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
      }

      // Check if task would go past work hours (5 PM)
      const endTime = new Date(currentTime.getTime() + task.est_minutes * 60000);
      if (endTime.getHours() >= 17) {
        // Move to next day
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
        continue;
      }

      // Check hard deadline
      if (task.hard_deadline && task.due_at && endTime > new Date(task.due_at)) {
        continue; // Skip this task for now
      }

      // Create event block
      eventBlocks.push({
        id: Date.now() + Math.random(), // Temporary ID
        task_id: task.id,
        starts_at: new Date(currentTime).toISOString(),
        ends_at: endTime.toISOString(),
        source: 'auto'
      });

      // Move current time forward
      currentTime = new Date(endTime.getTime() + 15 * 60000); // 15 min break
    }

    res.json(eventBlocks);
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: 'Failed to generate schedule' });
  }
};

const getEventBlocks = (req, res) => {
  try {
    const db = getDb();
    const blocks = db.prepare('SELECT * FROM event_blocks ORDER BY starts_at ASC').all();
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching event blocks:', error);
    res.status(500).json({ error: 'Failed to fetch event blocks' });
  }
};

const commitEventBlocks = (req, res) => {
  try {
    const { blocks } = req.body;
    const db = getDb();

    // Clear existing auto-generated blocks
    db.prepare('DELETE FROM event_blocks WHERE source = ?').run('auto');

    // Insert new blocks
    const insertBlock = db.prepare(`
      INSERT INTO event_blocks (task_id, starts_at, ends_at, source)
      VALUES (?, ?, ?, ?)
    `);

    for (const block of blocks) {
      insertBlock.run(block.task_id, block.starts_at, block.ends_at, 'auto');
    }

    res.json({ message: 'Schedule committed successfully', blocks_count: blocks.length });
  } catch (error) {
    console.error('Error committing event blocks:', error);
    res.status(500).json({ error: 'Failed to commit schedule' });
  }
};

const getWorkHours = (req, res) => {
  try {
    const db = getDb();
    const workHours = db.prepare('SELECT * FROM work_hours WHERE user_id = ? ORDER BY weekday').all(req.user.id);
    res.json(workHours);
  } catch (error) {
    console.error('Error fetching work hours:', error);
    res.status(500).json({ error: 'Failed to fetch work hours' });
  }
};

const updateWorkHours = (req, res) => {
  try {
    const { schedule } = req.body; // Array of {weekday, start_time, end_time}
    const db = getDb();

    // Clear existing work hours
    db.prepare('DELETE FROM work_hours WHERE user_id = ?').run(req.user.id);

    // Insert new work hours
    const insertHours = db.prepare(`
      INSERT INTO work_hours (user_id, weekday, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);

    for (const hours of schedule) {
      insertHours.run(req.user.id, hours.weekday, hours.start_time, hours.end_time);
    }

    res.json({ message: 'Work hours updated successfully' });
  } catch (error) {
    console.error('Error updating work hours:', error);
    res.status(500).json({ error: 'Failed to update work hours' });
  }
};

module.exports = {
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
};