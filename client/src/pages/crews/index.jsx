
import React, { useState } from 'react';
import { Bot, Plus, Search, Filter, Play, Calendar, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import SectionTitle from '../../components/ui/SectionTitle';

export default function CrewsIndex() {
  const [crews, setCrews] = useState([
    { id: 1, name: 'Blog Writer', description: 'Creates SEO-optimized blog posts', status: 'active', lastRun: '2 hours ago' },
    { id: 2, name: 'Social Media Manager', description: 'Generates social media content', status: 'draft', lastRun: 'Never' },
    { id: 3, name: 'Email Marketer', description: 'Crafts engaging email campaigns', status: 'active', lastRun: '1 day ago' },
  ]);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crews</h1>
          <p className="text-[var(--muted)]">AI-powered content creation workflows</p>
        </div>
        <Link to="/crews/new" className="btn-brand flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Crew</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search crews..."
            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid gap-6">
        {crews.map((crew) => (
          <Card key={crew.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--brand-100)] rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[var(--brand-600)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{crew.name}</h3>
                  <p className="text-[var(--muted)] text-sm">{crew.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      crew.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {crew.status}
                    </span>
                    <span className="text-xs text-[var(--muted)]">Last run: {crew.lastRun}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="btn-brand flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
