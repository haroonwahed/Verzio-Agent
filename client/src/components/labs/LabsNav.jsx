import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

function LabsNav() {
  const location = useLocation();

  const isCrewsEnabled = import.meta.env.VITE_FEATURE_CREWS === 'true';
  const isPlannerEnabled = import.meta.env.VITE_FEATURE_PLANNER === 'true';

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="labs-nav-container">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900">🧪 Labs</h1>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              Experimental Features
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            {isCrewsEnabled && (
              <Link
                to="/labs/crews"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/labs/crews')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>AI Crews</span>
              </Link>
            )}

            {isPlannerEnabled && (
              <Link
                to="/labs/planner/board"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/labs/planner')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Planner</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}