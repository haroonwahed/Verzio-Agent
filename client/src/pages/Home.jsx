
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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
    <div className="min-h-screen text-white" style={{background: 'linear-gradient(180deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)', fontFamily: 'Inter, system-ui, -apple-system, sans-serif'}}>
      <style>{`
        :root {
          --primary: #9333ea;
          --accent: #c084fc;
          --bg: #0c0c0c;
          --fg: #ffffff;
          --muted: #6b7280;
          --rad: 12px;
        }

        .glass {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          border-color: rgba(255, 255, 255, 0.12);
        }
      `}</style>

      {/* Header */}
      <header className="relative border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Creeator</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#product" className="text-gray-300 hover:text-white transition-colors">Product</a>
              <a href="#templates" className="text-gray-300 hover:text-white transition-colors">Templates</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Docs</a>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
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
        
        <div id="mobile-menu" className="mobile-menu hidden md:hidden bg-black/95 border-b border-white/10">
          <nav className="px-4 py-4 space-y-2">
            <a href="#product" className="block px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Product</a>
            <a href="#templates" className="block px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Templates</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Pricing</a>
            <a href="#docs" className="block px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Docs</a>
            <Link to="/login" className="block px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Login</Link>
            <Link to="/signup" className="block mt-4 text-center bg-purple-600 text-white px-4 py-2 rounded-lg font-medium">Start free</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              AI-Powered Content Creation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Generate high-quality text, images, and voice content with our advanced AI platform. 
              Build workflows, optimize for SEO, and scale your content creation like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Creating</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
              <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Powerful AI tools and workflow automation to create, optimize, and distribute content across all your channels.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">AI Workflow Builder</h3>
            <p className="text-gray-300 leading-relaxed">Drag-and-drop workflow steps: research, outline, write, edit, optimize, and publish with intelligent automation.</p>
          </div>

          <div className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Smart Content Generation</h3>
            <p className="text-gray-300 leading-relaxed">Generate blog posts, social media content, emails, and more with AI that understands your brand voice and audience.</p>
          </div>

          <div className="glass rounded-xl p-8 hover:border-white/20 transition-all duration-300 group">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Multi-Channel Publishing</h3>
            <p className="text-gray-300 leading-relaxed">Publish and distribute your content across multiple platforms simultaneously with optimized formatting for each channel.</p>
          </div>
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
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold">Creeator</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Transform your content creation process with AI-powered workflows and intelligent automation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Creeator. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
