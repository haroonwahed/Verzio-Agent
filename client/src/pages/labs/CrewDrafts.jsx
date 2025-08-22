
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LabsNav from '../../components/labs/LabsNav';

function CrewDrafts() {
  const { id } = useParams();
  const [crew, setCrew] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [crewRes, draftsRes] = await Promise.all([
        axios.get(`/api/crews/${id}`),
        axios.get(`/api/crews/${id}/drafts`)
      ]);
      setCrew(crewRes.data);
      setDrafts(draftsRes.data);
      if (draftsRes.data.length > 0) {
        setSelectedDraft(draftsRes.data[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
        <div className="flex items-center mb-6">
          <Link to="/labs/crews" className="text-purple-400 hover:text-purple-300 mr-4">
            ← Back to Crews
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{crew?.name} - Drafts</h1>
            <p className="text-gray-400">{crew?.template_name}</p>
          </div>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No drafts yet</h3>
            <p className="text-gray-400 mb-6">Run this crew to generate your first draft.</p>
            <Link
              to="/labs/crews"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Crews
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Drafts List */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Drafts ({drafts.length})</h3>
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => setSelectedDraft(draft)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDraft?.id === draft.id 
                          ? 'bg-purple-500/20 border border-purple-500/30' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Draft #{draft.id}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            SEO: {draft.score}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(draft.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Draft Content */}
            <div className="lg:col-span-2">
              {selectedDraft && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Editor</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          SEO Score: {selectedDraft.score}
                        </span>
                      </div>
                    </div>
                    <textarea
                      value={selectedDraft.content_md}
                      onChange={() => {}} // Read-only for now
                      className="w-full h-96 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white font-mono text-sm resize-none"
                      readOnly
                    />
                  </div>

                  {/* Preview */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-4">Preview</h3>
                    <div className="labs-content-preview bg-white/5 rounded-lg p-4 h-96 overflow-y-auto prose prose-invert prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: selectedDraft.content_md
                          .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/^(.+)$/gm, '<p>$1</p>')
                          .replace(/<p><h/g, '<h')
                          .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
                      }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrewDrafts;
