
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ApiDocs() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{
      background: isDarkMode
        ? 'linear-gradient(180deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)'
    }}>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6">API Documentation</h1>
        <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Build powerful integrations with the Creeator API
        </p>
        <div className="p-6 rounded-xl border border-white/10">
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>API documentation coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default ApiDocs;
