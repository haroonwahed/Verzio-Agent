
const db = require('../../db');

// Task model
const createTask = (title, notes, priority, estMinutes, dueAt, hardDeadline, tags = '') => {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, notes, priority, est_minutes, due_at, hard_deadline, status, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'todo', ?, datetime('now'), datetime('now'))
  `);
  return stmt.run(title, notes, priority, estMinutes, dueAt, hardDeadline, tags);
};

const getTasks = () => {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
  return stmt.all();
};

const getTaskById = (id) => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
};

const updateTask = (id, updates) => {
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  const stmt = db.prepare(`UPDATE tasks SET ${fields}, updated_at = datetime('now') WHERE id = ?`);
  return stmt.run(...values);
};

// TaskLink model
const createTaskLink = (taskId, dependsOnTaskId) => {
  const stmt = db.prepare('INSERT INTO task_links (task_id, depends_on_task_id) VALUES (?, ?)');
  return stmt.run(taskId, dependsOnTaskId);
};

const getTaskDependencies = (taskId) => {
  const stmt = db.prepare(`
    SELECT t.* FROM tasks t 
    JOIN task_links tl ON t.id = tl.depends_on_task_id 
    WHERE tl.task_id = ?
  `);
  return stmt.all(taskId);
};

// WorkHours model
const createWorkHours = (userId, weekday, startTime, endTime, timezone) => {
  const stmt = db.prepare(`
    INSERT INTO work_hours (user_id, weekday, start_time, end_time, timezone)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(userId, weekday, startTime, endTime, timezone);
};

const getWorkHours = (userId) => {
  const stmt = db.prepare('SELECT * FROM work_hours WHERE user_id = ? ORDER BY weekday, start_time');
  return stmt.all(userId);
};

// EventBlock model
const createEventBlock = (taskId, startsAt, endsAt, source, calendarId = null) => {
  const stmt = db.prepare(`
    INSERT INTO event_blocks (task_id, starts_at, ends_at, source, calendar_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(taskId, startsAt, endsAt, source, calendarId);
};

const getEventBlocks = (startDate, endDate) => {
  const stmt = db.prepare(`
    SELECT eb.*, t.title as task_title, t.priority 
    FROM event_blocks eb 
    LEFT JOIN tasks t ON eb.task_id = t.id 
    WHERE eb.starts_at >= ? AND eb.ends_at <= ?
    ORDER BY eb.starts_at
  `);
  return stmt.all(startDate, endDate);
};

const deleteEventBlocks = (taskId) => {
  const stmt = db.prepare('DELETE FROM event_blocks WHERE task_id = ? AND source = "auto"');
  return stmt.run(taskId);
};

// CalendarSource model
const createCalendarSource = (userId, type, urlOrToken, enabled = true) => {
  const stmt = db.prepare(`
    INSERT INTO calendar_sources (user_id, type, url_or_token, enabled, last_sync_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  return stmt.run(userId, type, urlOrToken, enabled);
};

const getCalendarSources = (userId) => {
  const stmt = db.prepare('SELECT * FROM calendar_sources WHERE user_id = ?');
  return stmt.all(userId);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  createTaskLink,
  getTaskDependencies,
  createWorkHours,
  getWorkHours,
  createEventBlock,
  getEventBlocks,
  deleteEventBlocks,
  createCalendarSource,
  getCalendarSources
};
