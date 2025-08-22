import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TestTube, Users, Calendar } from 'lucide-react';

export default function LabsNav() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="labs-nav bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <TestTube className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl">Labs</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Beta</span>
            </Link>
          </div>

          <nav className="flex space-x-6">
            {import.meta.env.VITE_FEATURE_CREWS === 'true' && (
              <Link
                to="/labs/crews"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/labs/crews')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Crews</span>
              </Link>
            )}

            {import.meta.env.VITE_FEATURE_PLANNER === 'true' && (
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