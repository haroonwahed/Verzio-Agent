
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  console.log('App component rendering...');
  console.log('Current location:', window.location.href);
  console.log('React version:', React.version);
  
  // Add error catching
  React.useEffect(() => {
    const handleError = (error) => {
      console.error('Uncaught error:', error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  return (
    <div className="App min-h-screen bg-gray-50">
      <AuthProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
