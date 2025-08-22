
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Pricing() {
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
      <div className="mx-auto max-w-7xl px-4 py-16">
        <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Simple, transparent pricing</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Choose the plan that fits your content creation needs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 rounded-xl border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-4">Starter</h3>
            <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 5 AI Agents</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 10 Workflows</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Basic integrations</li>
            </ul>
            <Link to="/signup" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors block text-center">
              Start Free Trial
            </Link>
          </div>
          
          <div className="p-8 rounded-xl border-2 border-purple-500 text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-4">Professional</h3>
            <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 25 AI Agents</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited Workflows</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> All integrations</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Priority support</li>
            </ul>
            <Link to="/signup" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors block text-center">
              Start Free Trial
            </Link>
          </div>
          
          <div className="p-8 rounded-xl border border-white/10 text-center">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Unlimited everything</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Custom integrations</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Dedicated support</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SLA & security</li>
            </ul>
            <Link to="/signup" className="w-full border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white py-3 px-6 rounded-lg font-medium transition-colors block text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
