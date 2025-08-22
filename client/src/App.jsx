import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Wolleys from './pages/Wolleys'
import Workflows from './pages/Workflows'
import MediaStudio from './pages/MediaStudio'
import ContentWriter from './pages/ContentWriter'
import Templates from './pages/Templates'
import Documentation from './pages/Documentation'
import ApiDocs from './pages/ApiDocs'
import Guides from './pages/Guides'
import Blog from './pages/Blog'
import Pricing from './pages/Pricing'

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
        {/* Redirect all unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;