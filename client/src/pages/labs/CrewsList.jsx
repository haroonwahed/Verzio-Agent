
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LabsNav from '../../components/labs/LabsNav';

function CrewsList() {
  const [crews, setCrews] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCrewModal, setShowNewCrewModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [crewsRes, templatesRes] = await Promise.all([
        axios.get('/api/crews'),
        axios.get('/api/crews/templates')
      ]);
      setCrews(crewsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runCrew = async (crewId) => {
    try {
      await axios.post(`/api/crews/${crewId}/run`);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error running crew:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300';
      case 'running': return 'bg-yellow-500/20 text-yellow-300';
      case 'done': return 'bg-green-500/20 text-green-300';
      case 'failed': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <LabsNav />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <LabsNav />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crews</h1>
            <p className="text-gray-400">Reusable content generation workflows</p>
          </div>
          <button
            onClick={() => setShowNewCrewModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            New Crew
          </button>
        </div>

        {crews.length === 0 ? (
          <div className="labs-empty-state text-center py-16">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Crews yet</h3>
            <p className="text-gray-400 mb-6">Create your first crew to generate content and automate workflows.</p>
            <button
              onClick={() => setShowNewCrewModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create First Crew
            </button>
          </div>
        ) : (
          <div className="labs-crews-grid">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-medium text-gray-300">Name</th>
                      <th className="text-left p-4 font-medium text-gray-300">Template</th>
                      <th className="text-left p-4 font-medium text-gray-300">Status</th>
                      <th className="text-left p-4 font-medium text-gray-300">Last Run</th>
                      <th className="text-left p-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crews.map((crew) => (
                      <tr key={crew.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-white">{crew.name}</div>
                            {crew.tags && (
                              <div className="text-sm text-gray-400 mt-1">{crew.tags}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{crew.template_name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(crew.status)}`}>
                            {crew.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(crew.updated_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => runCrew(crew.id)}
                              disabled={crew.status === 'running'}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Run Crew
                            </button>
                            <Link
                              to={`/labs/crews/${crew.id}/drafts`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              View Drafts
                            </Link>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                              Duplicate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Crew Modal */}
      {showNewCrewModal && (
        <NewCrewModal
          templates={templates}
          onClose={() => setShowNewCrewModal(false)}
          onCreated={() => {
            setShowNewCrewModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function NewCrewModal({ templates, onClose, onCreated }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [inputs, setInputs] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/crews', {
        name,
        template_id: selectedTemplate,
        purpose,
        inputs_json: inputs
      });
      onCreated();
    } catch (error) {
      console.error('Error creating crew:', error);
    }
  };

  const template = templates.find(t => t.id === parseInt(selectedTemplate));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Crew</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            >
              <option value="">Choose template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Purpose</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
              required
            />
          </div>

          {template && template.fields_json && template.fields_json.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={inputs[field.name] || ''}
                onChange={(e) => setInputs(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Create Crew
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrewsList;
