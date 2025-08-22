
const { getDb } = require('../../db');

const createTask = (title, notes, priority, est_minutes, due_at, hard_deadline, tags) => {
  const db = getDb();
  return db.prepare(`
    INSERT INTO tasks (title, notes, priority, est_minutes, due_at, hard_deadline, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, notes, priority, est_minutes, due_at, hard_deadline, tags);
};

const getTasks = () => {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
};

const updateTask = (id, updates) => {
  const db = getDb();
  const fields = [];
  const values = [];
  
  Object.keys(updates).forEach(key => {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  });
  
  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  return db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
};

const deleteTask = (id) => {
  const db = getDb();
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
};

const getWorkHours = (userId) => {
  const db = getDb();
  return db.prepare('SELECT * FROM work_hours WHERE user_id = ? ORDER BY weekday').all(userId);
};

const getEventBlocks = (startDate, endDate) => {
  const db = getDb();
  if (startDate && endDate) {
    return db.prepare('SELECT * FROM event_blocks WHERE starts_at >= ? AND ends_at <= ? ORDER BY starts_at ASC').all(startDate, endDate);
  }
  return db.prepare('SELECT * FROM event_blocks ORDER BY starts_at ASC').all();
};

const createEventBlock = (taskId, startsAt, endsAt, source) => {
  const db = getDb();
  return db.prepare(`
    INSERT INTO event_blocks (task_id, starts_at, ends_at, source)
    VALUES (?, ?, ?, ?)
  `).run(taskId, startsAt, endsAt, source);
};

const deleteEventBlocks = (taskId) => {
  const db = getDb();
  return db.prepare('DELETE FROM event_blocks WHERE task_id = ? AND source = ?').run(taskId, 'auto');
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getWorkHours,
  getEventBlocks,
  createEventBlock,
  deleteEventBlocks
};
