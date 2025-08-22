import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initialize theme from localStorage or default to dark
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

  useEffect(() => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
      }
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Cleanup
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener('click', toggleMenu);
      }
    };
  }, []);

  const toggleFAQ = (element) => {
    // This is handled by the native details/summary behavior
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{
      background: isDarkMode
        ? 'linear-gradient(180deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        :root {
          --primary: #9333ea;
          --accent: #c084fc;
          --bg: ${isDarkMode ? '#0c0c0c' : '#ffffff'};
          --fg: ${isDarkMode ? '#ffffff' : '#111827'};
          --muted: ${isDarkMode ? '#6b7280' : '#6b7280'};
          --rad: 12px;
        }

        .glass {
          background: ${isDarkMode
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))'
            : 'linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.02))'};
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          backdrop-filter: blur(20px);
        }

        .mobile-menu {
          display: none;
        }

        .mobile-menu:not(.hidden) {
          display: block;
        }

        @media (max-width: 768px) {
          .md\\:hidden {
            display: none;
          }
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 3px;
        }

        a:focus-visible,
        button:focus-visible,
        details summary:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .glass:hover {
          background: ${isDarkMode
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))'
            : 'linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.04))'};
          border-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'};
        }
      `}</style>

      {/* Header */}
      <header className={`relative border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 relative">
                  {/* Modern brain-like logo */}
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
            </a>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#product" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Product</a>
              <a href="#templates" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Templates</a>
              <a href="#pricing" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Pricing</a>
              <a href="#docs" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Docs</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                aria-label="Toggle theme"
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

            <button id="menu-toggle" className="md:hidden p-2 text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </nav>

        <div id="mobile-menu" className={`mobile-menu hidden md:hidden ${isDarkMode ? 'bg-black/95 border-b border-white/10' : 'bg-white/95 border-b border-gray-200'}`}>
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
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
              <span>Toggle theme</span>
            </button>
            <a href="#product" className={`block px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Product</a>
            <a href="#templates" className={`block px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Templates</a>
            <a href="#pricing" className={`block px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Pricing</a>
            <a href="#docs" className={`block px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Docs</a>
            <Link to="/login" className={`block px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Login</Link>
            <Link to="/signup" className="block mt-4 text-center bg-purple-600 text-white px-4 py-2 rounded-lg font-medium">Start free</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create content <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">10× faster</span> with AI workflows
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              Transform your content creation with intelligent AI agents. Build custom workflows that research, write, optimize, and publish across all your channels automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Creating</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
              <button className={`border px-8 py-4 rounded-xl text-lg font-semibold transition-colors ${isDarkMode ? 'border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'}`}>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-purple-500 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-600 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="product" className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to go from idea → published</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Powerful AI tools and workflow automation to create, optimize, and distribute content across all your channels.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/signup" className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group cursor-pointer transform hover:scale-105">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">AI Workflow Builder</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Drag-and-drop workflow steps: research, outline, write, edit, optimize, and publish with intelligent automation.</p>
            <div className="mt-4 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="text-sm font-medium">Try workflows →</span>
            </div>
          </Link>

          <Link to="/signup" className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group cursor-pointer transform hover:scale-105">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Smart AI Agents</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Deploy specialized AI agents that understand your brand voice and create consistent, high-quality content across all formats.</p>
            <div className="mt-4 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="text-sm font-medium">Start generating →</span>
            </div>
          </Link>

          <Link to="/signup" className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group cursor-pointer transform hover:scale-105">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Multi-Format Generation</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Create blog posts, social media content, product descriptions, images, voiceovers, and more—all optimized for your channels.</p>
            <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-sm font-medium">Explore publishing →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Workflow Builder Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Build Custom AI Workflows</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Design powerful automated workflows that connect multiple AI tools and external services to streamline your content creation process.</p>
        </div>

        <div className="glass rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Visual Workflow Designer</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold mb-2">Choose Your Steps</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select from text generation, image creation, voice synthesis, SEO analysis, and more.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold mb-2">Connect & Configure</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Link steps together and customize parameters for each AI tool in your workflow.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold mb-2">Automate & Scale</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Run workflows on demand or schedule them to create content automatically.</p>
                  </div>
                </div>
              </div>
              <Link to="/signup" className="inline-flex items-center mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Try Workflow Builder
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Generate Text</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <span className="font-medium">SEO Analysis</span>
                  </div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <span className="font-medium">Publish Content</span>
                  </div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Connect with your favorite tools</h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Seamlessly integrate with thousands of external tools and platforms to streamline your workflow.</p>
        </div>

        <div className="relative">
          {/* Central Hub */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl animate-pulse"></div>
            </div>
          </div>

          {/* Integration Icons */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
            {/* Row 1 */}
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.875 3H4.125C2.953 3 2 3.897 2 5v14c0 1.103.953 2 2.125 2h15.75C21.047 21 22 20.103 22 19V5c0-1.103-.953-2-2.125-2zm-4.75 11.188c0 .515-.203.873-.531.873-.328 0-.656-.515-.656-.873v-4.781c0-.515.328-.515.656-.515.328 0 .531 0 .531.515v4.781zm-2.609 0c0 .515-.203.873-.531.873-.328 0-.656-.515-.656-.873v-4.781c0-.515.328-.515.656-.515.328 0 .531 0 .531.515v4.781zm-2.609 0c0 .515-.203.873-.531.873-.328 0-.656-.515-.656-.873v-4.781c0-.515.328-.515.656-.515.328 0 .531 0 .531.515v4.781z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 12.364l10.091-8.543h.273c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 6.375c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H2.625c-.621 0-1.125-.504-1.125-1.125v-.75zM1.5 12c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125s-.504 1.125-1.125 1.125H2.625c-.621 0-1.125-.504-1.125-1.125zM1.5 17.625c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125s-.504 1.125-1.125 1.125H2.625c-.621 0-1.125-.504-1.125-1.125z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer">
              <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.149 0h19.702c1.184 0 2.149.966 2.149 2.149v19.702c0 1.184-.965 2.149-2.149 2.149H2.149A2.15 2.15 0 0 1 0 21.851V2.149C0 .965.965 0 2.149 0zM8.93 18.338h2.613V9.714H8.93v8.624zm1.306-9.8c.837 0 1.516-.679 1.516-1.516s-.679-1.516-1.516-1.516-1.516.679-1.516 1.516.679 1.516 1.516 1.516zm7.756 9.8h2.613v-4.685c0-2.45-.524-4.34-3.394-4.34-1.378 0-2.304.756-2.682 1.474h-.04V9.714h-2.573v8.624h2.682v-4.267c0-1.13.214-2.224 1.614-2.224 1.38 0 1.4 1.294 1.4 2.295v4.196z"/>
              </svg>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/app" className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
              Explore All Integrations
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Everything you need to know about Creeator and how it works.</p>
        </div>

        <div className="space-y-4">
          <details className={`group rounded-xl p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
              <span>What is Creeator and how does it work?</span>
              <svg className="w-5 h-5 text-purple-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Creeator is an AI-powered content creation platform that helps you generate high-quality text, images, and voice content. Our advanced workflow builder allows you to connect multiple AI tools and automate your entire content creation process from research to publishing.</p>
            </div>
          </details>

          <details className={`group rounded-xl p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
              <span>How can I customize my content workflows?</span>
              <svg className="w-5 h-5 text-purple-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Our visual workflow builder lets you drag and drop different AI tools and steps to create custom automation. You can configure AI agents, add research sources, set tone and style, include SEO requirements, and define approval workflows to match your exact needs.</p>
            </div>
          </details>

          <details className={`group rounded-xl p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
              <span>What integrations are available?</span>
              <svg className="w-5 h-5 text-purple-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Creeator integrates with thousands of external tools including Google Drive, GitHub, Facebook, Instagram, Gmail, Slack, Google Analytics, and many more. You can connect these tools directly into your workflows to automate publishing and distribution.</p>
            </div>
          </details>

          <details className={`group rounded-xl p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
              <span>Is there a free trial available?</span>
              <svg className="w-5 h-5 text-purple-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Yes! We offer a 14-day free trial with no credit card required. You can explore all features, create workflows, and generate content to see how Creeator fits into your content creation process. Cancel anytime during the trial period.</p>
            </div>
          </details>

          <details className={`group rounded-xl p-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
              <span>How does the AI content generation work?</span>
              <svg className="w-5 h-5 text-purple-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>Our AI uses advanced machine learning models to understand your brand voice, target audience, and content requirements. You can train the AI with your existing content, set specific parameters for tone and style, and the system will generate content that matches your brand consistently.</p>
            </div>
          </details>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your content workflow?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of content teams who have 10x'd their productivity with AI-powered workflows.
            Start creating better content faster today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              Start creating for free
            </Link>
            <button className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Book a demo
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <a href="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Creeator</span>
              </a>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 max-w-sm`}>
                The AI-powered content creation platform that helps teams build, optimize, and publish high-performing content 10x faster.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#features" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Features</a></li>
                <li><a href="#pricing" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Pricing</a></li>
                <li><a href="/app" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Templates</a></li>
                <li><a href="/app" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Integrations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#about" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>About</a></li>
                <li><a href="https://blog.creeator.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Blog</a></li>
                <li><a href="mailto:careers@creeator.ai" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Careers</a></li>
                <li><a href="mailto:hello@creeator.ai" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="https://help.creeator.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Help Center</a></li>
                <li><a href="https://docs.creeator.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Documentation</a></li>
                <li><a href="https://api.creeator.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>API</a></li>
                <li><a href="https://status.creeator.ai" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}>Status</a></li>
              </ul>
            </div>
          </div>

          <div className={`border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>© 2024 Creeator. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Privacy</a>
              <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Terms</a>
              <a href="#" className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;