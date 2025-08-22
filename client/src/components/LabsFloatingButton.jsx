
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LabsFloatingButton() {
  const [showLabsFeatures, setShowLabsFeatures] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if Labs features are enabled
    const checkFeatures = async () => {
      try {
        // Try to access crews endpoint to check if enabled
        const crewsResponse = await fetch('/api/crews/templates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const plannerResponse = await fetch('/api/planner/tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // If either endpoint works (doesn't return 404), show Labs button
        if (crewsResponse.status !== 404 || plannerResponse.status !== 404) {
          setShowLabsFeatures(true);
        }
      } catch (error) {
        // If there's an error, assume features are disabled
        console.log('Labs features not available');
      }
    };

    checkFeatures();
  }, []);

  if (!showLabsFeatures) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute bottom-16 right-0 bg-gray-900 border border-white/10 rounded-xl p-2 w-48 shadow-xl">
            <Link
              to="/labs/crews"
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Crews</div>
                  <div className="text-xs text-gray-400">Content workflows</div>
                </div>
              </div>
            </Link>
            
            <Link
              to="/labs/planner/board"
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Planner</div>
                  <div className="text-xs text-gray-400">Task scheduling</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        >
          <div className="relative">
            <span className="text-lg font-bold">L</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </button>

        {/* Beta Badge */}
        <div className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
          BETA
        </div>
      </div>
    </div>
  );
}

export default LabsFloatingButton;
