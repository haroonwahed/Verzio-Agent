
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Templates() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{
      background: isDarkMode
        ? 'linear-gradient(180deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header className={`relative border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 relative">
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Creeator</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Content Platform</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                )}
              </button>
              <Link to="/login" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} px-4 py-2 rounded-lg transition-colors`}>
                Login
              </Link>
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Start free
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready-to-use <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">content templates</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-4xl mx-auto`}>
              Browse our collection of proven templates for every content type. Get started quickly with professionally designed workflows and AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Browse Templates</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">Blog Post Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Professional blog post structures for different industries and content types.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>

          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">Social Media Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Engaging social media post templates for all major platforms.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>

          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">Email Campaign Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>High-converting email templates for marketing campaigns.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>

          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">Product Description Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Compelling product description formats for e-commerce.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>

          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">SEO Content Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Search-optimized content structures that rank well.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>

          <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-bold mb-4">Video Script Templates</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Professional video script formats for YouTube and social media.</p>
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">View templates →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Templates;
