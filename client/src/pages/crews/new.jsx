
import React, { useState } from 'react';
import { ArrowLeft, Bot, Wand2, FileText, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import SectionTitle from '../../components/ui/SectionTitle';

export default function NewCrew() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [crewName, setCrewName] = useState('');
  const [crewDescription, setCrewDescription] = useState('');

  const templates = [
    { id: 'blog-writer', name: 'Blog Writer', description: 'Creates SEO-optimized blog posts', icon: FileText },
    { id: 'social-media', name: 'Social Media Manager', description: 'Generates social content', icon: Image },
    { id: 'email-marketer', name: 'Email Marketer', description: 'Crafts email campaigns', icon: Wand2 },
  ];

  return (
    <div className="px-8 py-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/crews" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Crew</h1>
          <p className="text-[var(--muted)]">Set up an AI-powered content workflow</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <SectionTitle>Choose a Template</SectionTitle>
          <div className="grid gap-4 mb-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedTemplate === template.id
                    ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
                    : 'border-[var(--border)] hover:border-[var(--brand-300)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedTemplate === template.id ? 'bg-[var(--brand-500)]' : 'bg-gray-100'
                  }`}>
                    <template.icon className={`w-5 h-5 ${
                      selectedTemplate === template.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Crew Name</label>
              <input
                type="text"
                value={crewName}
                onChange={(e) => setCrewName(e.target.value)}
                placeholder="e.g., My Blog Writer"
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <textarea
                value={crewDescription}
                onChange={(e) => setCrewDescription(e.target.value)}
                placeholder="What does this crew do?"
                rows={3}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Link to="/crews" className="px-6 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50">
              Cancel
            </Link>
            <button 
              className="btn-brand flex items-center space-x-2"
              disabled={!selectedTemplate || !crewName}
            >
              <Bot className="w-4 h-4" />
              <span>Create Crew</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
