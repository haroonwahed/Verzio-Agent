const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env in development
dotenv.config();

const { init: initDb } = require('./db');

// Route imports
const authRoutes = require('./routes/auth');
const textRoutes = require('./routes/text');
const imageRoutes = require('./routes/image');
const voiceRoutes = require('./routes/voice');
const seoRoutes = require('./routes/seo');
const feedsRoutes = require('./routes/feeds');
const workflowRoutes = require('./routes/workflows');
const wolleysRoutes = require('./routes/wolleys');
const chatRoutes = require('./routes/chat');
const libraryRoutes = require('./routes/library');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize SQLite tables before setting up routes
try {
  initDb();
  console.log('Database setup complete');
} catch (error) {
  console.error('Database setup failed:', error);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Verzio API Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/text', textRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/wolleys', wolleysRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Frontend should be accessible on port 5173`);
});