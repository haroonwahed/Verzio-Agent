
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res) => {
  try {
    console.log('Signup request received:', { email: req.body.email, name: req.body.name });
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('Missing fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
    const result = stmt.run(email, hashedPassword, name);
    
    console.log('User created successfully:', { id: result.lastInsertRowid, email });
    
    const user = { id: result.lastInsertRowid, email, name };
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
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
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
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

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Demo user support
    if (userId === 1) {
      return res.json({
        user: { id: 1, email: 'demo@verzio.com', name: 'Demo User' }
      });
    }

    const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  getMe
};
