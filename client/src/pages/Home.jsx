
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  console.log('Home component rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Verzio
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          AI-powered content creation platform
        </p>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
