const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open a database file, default to data.db in project root
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables if they don't exist
function init() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS workflows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        definition TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );

    // Table for Wolleys (AI co‑worker configurations)
    db.run(
      `CREATE TABLE IF NOT EXISTS wolleys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        instructions TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );
  });
  console.log('Database initialized');
}

// Promise‑based helper functions
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function createUser({ email, password, role = 'user' }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, password, role],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, email, role });
      }
    );
  });
}

function saveWorkflow({ userId, name, definition }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO workflows (user_id, name, definition) VALUES (?, ?, ?)',
      [userId, name, JSON.stringify(definition)],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, userId, name, definition });
      }
    );
  });
}

function getWorkflowById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM workflows WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      if (row) row.definition = JSON.parse(row.definition);
      resolve(row);
    });
  });
}

// Create a new Wolley (AI co‑worker)
function createWolley({ userId, name, instructions }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO wolleys (user_id, name, instructions) VALUES (?, ?, ?)',
      [userId, name, instructions],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, userId, name, instructions });
      }
    );
  });
}

// Get all Wolleys for a user
function getWolleysByUser(userId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM wolleys WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Update a Wolley by id for a user
function updateWolley({ id, userId, name, instructions }) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE wolleys SET name = ?, instructions = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [name, instructions, id, userId],
      function (err) {
        if (err) return reject(err);
        resolve({ id, userId, name, instructions });
      }
    );
  });
}

// Delete a Wolley by id for a user
function deleteWolley(id, userId) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM wolleys WHERE id = ? AND user_id = ?', [id, userId], function (err) {
      if (err) return reject(err);
      resolve({ id });
    });
  });
}

module.exports = {
  db,
  init,
  getUserByEmail,
  createUser,
  saveWorkflow,
  getWorkflowById,
  // Wolleys API helpers
  createWolley,
  getWolleysByUser,
  updateWolley,
  deleteWolley,
};