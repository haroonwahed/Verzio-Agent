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
  });
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

module.exports = {
  db,
  init,
  getUserByEmail,
  createUser,
  saveWorkflow,
  getWorkflowById,
};