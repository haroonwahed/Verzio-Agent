import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './styles/theme-pro.css';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import ApiDocs from './pages/ApiDocs';
import Blog from './pages/Blog';
import Guides from './pages/Guides';
import Templates from './pages/Templates';
import ContentWriter from './pages/ContentWriter';
import Workflows from './pages/Workflows';
import MediaStudio from './pages/MediaStudio';
import Wolleys from './pages/Wolleys';
import CrewsIndex from './pages/crews/index';
import NewCrew from './pages/crews/new';

// Labs pages
import CrewsList from './pages/labs/CrewsList';
import CrewDrafts from './pages/labs/CrewDrafts';
import PlannerBoard from './pages/labs/PlannerBoard';
import PlannerCalendar from './pages/labs/PlannerCalendar';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public marketing site */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Product pages */}
        <Route path="/wolleys" element={<Wolleys />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/media-studio" element={<MediaStudio />} />
        <Route path="/content-writer" element={<ContentWriter />} />

        {/* Resource pages */}
        <Route path="/templates" element={<Templates />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/api" element={<ApiDocs />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/blog" element={<Blog />} />

        {/* Labs routes (feature flag gated) */}
        {import.meta.env.VITE_FEATURE_CREWS === 'true' && (
          <>
            <Route path="/labs/crews" element={<CrewsList />} />
            <Route path="/labs/crews/:id/drafts" element={<CrewDrafts />} />
          </>
        )}
        {import.meta.env.VITE_FEATURE_PLANNER === 'true' && (
          <>
            <Route path="/labs/planner/board" element={<PlannerBoard />} />
            <Route path="/labs/planner/calendar" element={<PlannerCalendar />} />
          </>
        )}

        {/* Protected dashboard */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
            <Route path="/crews" element={<PrivateRoute><CrewsIndex /></PrivateRoute>} />
            <Route path="/crews/new" element={<PrivateRoute><NewCrew /></PrivateRoute>} />
        {/* Redirect all unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;