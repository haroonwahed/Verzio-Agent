
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function LabsNav() {
  const location = useLocation();
  
  return (
    <div className="labs-nav bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="font-semibold text-white">Labs</span>
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md text-xs">BETA</span>
        </div>
        
        <nav className="flex items-center space-x-1">
          <Link 
            to="/labs/crews" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/labs/crews') 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Crews
          </Link>
          <Link 
            to="/labs/planner/board" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith('/labs/planner') 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Planner
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default LabsNav;
