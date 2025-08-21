const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Signup request received:', { email, name });

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', 
        [email, hashedPassword, name], 
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });

    const userId = result.lastID;
    const token = generateToken(userId);

    res.status(201).json({
      token,
      user: { id: userId, email, name }
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Demo user support
    if (email === 'demo@verzio.com' && password === 'demo123') {
      const demoUser = { id: 1, email: 'demo@verzio.com', name: 'Demo User' };
      const token = generateToken(1);
      return res.json({
        token,
        user: demoUser
      });
    }

    // Get user from database
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get user from database
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    // For demo user
    if (userId === 1) {
      return res.json({
        user: { id: 1, email: 'demo@verzio.com', name: 'Demo User' }
      });
    }

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, email, name FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  changePassword
};