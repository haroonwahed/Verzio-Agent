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
        name TEXT,
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

    // Migration: Add name column to users table if it doesn't exist
    db.run(`ALTER TABLE users ADD COLUMN name TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Migration error:', err);
      }
    });

    // Create the chat_messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        wolley_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (wolley_id) REFERENCES wolleys (id) ON DELETE CASCADE
      )
    `);

    // Create workflows table
    db.exec(`
      CREATE TABLE IF NOT EXISTS workflows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        steps TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crews tables (feature flag gated)
    if (process.env.FEATURE_CREWS === 'true') {
      db.exec(`
        CREATE TABLE IF NOT EXISTS crew_templates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          purpose TEXT NOT NULL,
          fields_json TEXT NOT NULL,
          prompt_schema_json TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS crews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          template_id INTEGER,
          purpose TEXT NOT NULL,
          inputs_json TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'draft',
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (template_id) REFERENCES crew_templates (id)
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS crew_drafts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          crew_id INTEGER NOT NULL,
          content_md TEXT NOT NULL,
          seo_meta_json TEXT NOT NULL,
          score INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (crew_id) REFERENCES crews (id)
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS crew_runs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          crew_id INTEGER NOT NULL,
          input_snapshot_json TEXT NOT NULL,
          output_snapshot_json TEXT NOT NULL,
          tokens_used INTEGER DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'queued',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (crew_id) REFERENCES crews (id)
        )
      `);
    }

    // Planner tables (feature flag gated)
    if (process.env.FEATURE_PLANNER === 'true') {
      db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          notes TEXT,
          priority TEXT NOT NULL DEFAULT 'med',
          est_minutes INTEGER DEFAULT 60,
          due_at DATETIME,
          hard_deadline BOOLEAN DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'todo',
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS task_links (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER NOT NULL,
          depends_on_task_id INTEGER NOT NULL,
          FOREIGN KEY (task_id) REFERENCES tasks (id),
          FOREIGN KEY (depends_on_task_id) REFERENCES tasks (id)
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS work_hours (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          weekday INTEGER NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          timezone TEXT DEFAULT 'UTC'
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS event_blocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER,
          starts_at DATETIME NOT NULL,
          ends_at DATETIME NOT NULL,
          source TEXT NOT NULL DEFAULT 'manual',
          calendar_id TEXT,
          FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
      `);

      db.exec(`
        CREATE TABLE IF NOT EXISTS calendar_sources (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          url_or_token TEXT NOT NULL,
          enabled BOOLEAN DEFAULT 1,
          last_sync_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    console.log('Database setup complete');
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

// Chat History Functions
function saveChatMessage({ userId, wolleyId, role, content }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO chat_messages (user_id, wolley_id, role, content) VALUES (?, ?, ?, ?)',
      [userId, wolleyId, role, content],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, userId, wolleyId, role, content });
      }
    );
  });
}

function getChatHistory({ userId, wolleyId }) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM chat_messages WHERE user_id = ? AND wolley_id = ? ORDER BY created_at ASC',
      [userId, wolleyId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function deleteChatHistory({ userId, wolleyId }) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM chat_messages WHERE user_id = ? AND wolley_id = ?',
      [userId, wolleyId],
      function (err) {
        if (err) return reject(err);
        resolve({ message: 'Chat history deleted successfully' });
      }
    );
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
  // Chat History API helpers
  saveChatMessage,
  getChatHistory,
  deleteChatHistory,
};