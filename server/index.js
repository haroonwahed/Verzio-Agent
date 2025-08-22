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
const PORT = 5000;  // Force port 5000 for development

// Initialize SQLite tables before setting up routes
try {
  initDb();
  console.log('Database setup complete');
} catch (error) {
  console.error('Database setup failed:', error);
  process.exit(1);
}

// Seed Labs data if features are enabled
// Note: Ensure VITE_FEATURE_CREWS and VITE_FEATURE_PLANNER are correctly set in your .env file
if (process.env.VITE_FEATURE_CREWS === 'true' || process.env.VITE_FEATURE_PLANNER === 'true') {
  // Assuming seed-labs.js is in the root or correctly referenced
  const seedLabs = require('./seed-labs'); 
  seedLabs();
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
app.use('/api/wolleys', wolleysRoutes);
app.use('/api/workflows', workflowRoutes);

// Planner API routes (always available, but UI is feature-gated)
const plannerController = require('./modules/planner/controller');
const auth = require('./middleware/auth');

app.get('/api/tasks', auth, plannerController.getTasks);
app.post('/api/tasks', auth, plannerController.createTask);
app.patch('/api/tasks/:id', auth, plannerController.updateTask);
app.delete('/api/tasks/:id', auth, plannerController.deleteTask);
app.post('/api/scheduler/plan', auth, plannerController.generateSchedule);
app.get('/api/blocks', auth, plannerController.getEventBlocks);
app.post('/api/blocks/commit', auth, plannerController.commitEventBlocks);

// Crews API routes (always available, but UI is feature-gated)
const crewsController = require('./modules/crews/controller');

app.get('/api/crews', auth, crewsController.getCrews);
app.post('/api/crews', auth, crewsController.createCrew);
app.get('/api/crew-templates', auth, crewsController.getCrewTemplates);
app.post('/api/crews/:id/run', auth, crewsController.runCrew);
app.get('/api/crews/:id/drafts', auth, crewsController.getCrewDrafts);

// Labs routes (conditionally enabled)
if (process.env.VITE_FEATURE_CREWS === 'true') {
  const crewsRoutes = require('./modules/crews/routes');
  app.use('/api/crews', crewsRoutes);
}

if (process.env.VITE_FEATURE_PLANNER === 'true') {
  const plannerRoutes = require('./modules/planner/routes');
  app.use('/api/planner', plannerRoutes);
}

// Serve static client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on http://0.0.0.0:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Frontend should be accessible on port 5174`);
});