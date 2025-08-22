import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TestTube } from 'lucide-react';

function LabsFloatingButton() {
  const [showLabsFeatures, setShowLabsFeatures] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [crewsEnabled, setCrewsEnabled] = useState(false);
  const [plannerEnabled, setPlannerEnabled] = useState(false);

  useEffect(() => {
    const checkFeatures = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setShowLabsFeatures(false);
          return;
        }

        const crewsResponse = await fetch('/api/crews/templates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCrewsEnabled(crewsResponse.status !== 404);

        const plannerResponse = await fetch('/api/planner/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPlannerEnabled(plannerResponse.status !== 404);

        if (crewsResponse.status !== 404 || plannerResponse.status !== 404) {
          setShowLabsFeatures(true);
        }
      } catch (error) {
        console.log('Labs features check failed:', error);
        setShowLabsFeatures(false);
      }
    };

    checkFeatures();
  }, []);

  // The original code had this conditional return. The new changes replace this entire block.
  // The new JSX will handle the conditional rendering based on showLabsFeatures and the dropdown state.

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Main Labs Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Labs Features"
        >
          <TestTube className="h-6 w-6" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-sm">Labs</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Beta</span>
              </div>
            </div>

            {crewsEnabled && (
              <Link
                to="/labs/crews"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDropdown(false)}
              >
                <span>🤖</span>
                <span>Crews</span>
              </Link>
            )}

            {plannerEnabled && (
              <Link
                to="/labs/planner/board"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDropdown(false)}
              >
                <span>📅</span>
                <span>Planner</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

export default LabsFloatingButton;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Beaker, X } from 'lucide-react';

function LabsFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if any labs features are enabled
  const isCrewsEnabled = import.meta.env.VITE_FEATURE_CREWS === 'true';
  const isPlannerEnabled = import.meta.env.VITE_FEATURE_PLANNER === 'true';
  
  // Don't show if no labs features are enabled
  if (!isCrewsEnabled && !isPlannerEnabled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="labs-floating-btn"
        title="Labs Features"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Beaker className="w-6 h-6" />}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[1001] min-w-[200px]">
          <h3 className="font-semibold text-gray-900 mb-3">Labs Features</h3>
          <div className="space-y-2">
            {isCrewsEnabled && (
              <Link
                to="/labs/crews"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                🤖 AI Crews
              </Link>
            )}
            {isPlannerEnabled && (
              <>
                <Link
                  to="/labs/planner/board"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  📋 Planner Board
                </Link>
                <Link
                  to="/labs/planner/calendar"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  📅 Planner Calendar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default LabsFloatingButton;
