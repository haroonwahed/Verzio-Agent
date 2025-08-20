const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env in development
dotenv.config();

const { init: initDb } = require('./db');

const authRoutes = require('./routes/auth');
const textRoutes = require('./routes/text');
const imageRoutes = require('./routes/image');
const voiceRoutes = require('./routes/voice');
const seoRoutes = require('./routes/seo');
const workflowRoutes = require('./routes/workflows');
const feedsRoutes = require('./routes/feeds');
const wolleysRoutes = require('./routes/wolleys');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite tables
initDb();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Verzio API Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/text', textRoutes);
app.use('/api/image', require('./routes/image'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/feeds', require('./routes/feeds'));
app.use('/api/voice', require('./routes/voice'));
app.use('/api/wolleys', require('./routes/wolleys'));
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/image', imageRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/wolleys', wolleysRoutes);

// Serve static client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});