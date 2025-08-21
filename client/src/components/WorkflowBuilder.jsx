
import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Play, Save, Trash2, Settings, ArrowRight, MessageSquare, Image, Mic, BarChart3 } from 'lucide-react';

function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState({
    name: 'New Workflow',
    steps: []
  });
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [editingStep, setEditingStep] = useState(null);

  const stepTypes = [
    { type: 'text', label: 'Generate Text', icon: MessageSquare, color: 'bg-blue-500' },
    { type: 'image', label: 'Generate Image', icon: Image, color: 'bg-purple-500' },
    { type: 'voice', label: 'Generate Voice', icon: Mic, color: 'bg-green-500' },
    { type: 'seo', label: 'SEO Analysis', icon: BarChart3, color: 'bg-orange-500' }
  ];

  const addStep = (type) => {
    const newStep = {
      id: Date.now().toString(),
      name: `${type} step`,
      type: type,
      params: getDefaultParams(type)
    };
    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const getDefaultParams = (type) => {
    switch (type) {
      case 'text':
        return { prompt: '', tone: '' };
      case 'image':
        return { prompt: '' };
      case 'voice':
        return { text: '', voice: 'nova' };
      case 'seo':
        return { content: '' };
      default:
        return {};
    }
  };

  const updateStep = (stepId, updates) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const removeStep = (stepId) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const saveWorkflow = async () => {
    if (!workflow.name.trim() || workflow.steps.length === 0) {
      alert('Please add a workflow name and at least one step');
      return;
    }

    setSaving(true);
    try {
      const definition = {
        steps: workflow.steps.map(step => ({
          name: step.name,
          type: step.type,
          params: step.params
        }))
      };
      await axios.post('/workflows/save', { 
        name: workflow.name, 
        definition 
      });
      alert('Workflow saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving workflow');
    } finally {
      setSaving(false);
    }
  };

  const runWorkflow = async () => {
    if (workflow.steps.length === 0) {
      alert('Please add at least one step to run the workflow');
      return;
    }

    setRunning(true);
    setResults(null);
    try {
      const definition = {
        steps: workflow.steps.map(step => ({
          name: step.name,
          type: step.type,
          params: step.params
        }))
      };
      const response = await axios.post('/workflows/run', { definition });
      setResults(response.data.results);
    } catch (err) {
      console.error(err);
      alert('Error running workflow: ' + (err.response?.data?.error || err.message));
    } finally {
      setRunning(false);
    }
  };

  const renderStepEditor = (step) => {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={step.name}
            onChange={(e) => updateStep(step.id, { name: e.target.value })}
            className="font-medium text-gray-900 bg-transparent border-none outline-none"
          />
          <button
            onClick={() => removeStep(step.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {step.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
              <textarea
                value={step.params.prompt}
                onChange={(e) => updateStep(step.id, { 
                  params: { ...step.params, prompt: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter your text generation prompt..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tone (optional)</label>
              <select
                value={step.params.tone}
                onChange={(e) => updateStep(step.id, { 
                  params: { ...step.params, tone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>
        )}

        {step.type === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Prompt</label>
            <textarea
              value={step.params.prompt}
              onChange={(e) => updateStep(step.id, { 
                params: { ...step.params, prompt: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Describe the image you want to generate..."
            />
          </div>
        )}

        {step.type === 'voice' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text to Speak</label>
              <textarea
                value={step.params.text}
                onChange={(e) => updateStep(step.id, { 
                  params: { ...step.params, text: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Enter text to convert to speech..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
              <select
                value={step.params.voice}
                onChange={(e) => updateStep(step.id, { 
                  params: { ...step.params, voice: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nova">Nova (English)</option>
                <option value="alloy">Alloy (English)</option>
                <option value="echo">Echo (English)</option>
                <option value="fable">Fable (English)</option>
                <option value="onyx">Onyx (English)</option>
                <option value="shimmer">Shimmer (English)</option>
              </select>
            </div>
          </div>
        )}

        {step.type === 'seo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content to Analyze</label>
            <textarea
              value={step.params.content}
              onChange={(e) => updateStep(step.id, { 
                params: { ...step.params, content: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Enter content for SEO analysis..."
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none"
                placeholder="Workflow Name"
              />
              <p className="text-gray-600 mt-1">Build automated AI workflows</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={saveWorkflow}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={runWorkflow}
                disabled={running || workflow.steps.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{running ? 'Running...' : 'Run Workflow'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Types Panel */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Steps</h3>
            <div className="space-y-3">
              {stepTypes.map((stepType) => {
                const Icon = stepType.icon;
                return (
                  <button
                    key={stepType.type}
                    onClick={() => addStep(stepType.type)}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className={`p-2 ${stepType.color} rounded-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stepType.label}</span>
                    <Plus className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
              <span className="text-sm text-gray-600">{workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}</span>
            </div>

            {workflow.steps.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No steps added yet</h3>
                <p className="text-gray-600">Click on the step types on the left to build your workflow</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {renderStepEditor(step)}
                    {index < workflow.steps.length - 1 && (
                      <div className="flex justify-center my-3">
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Results</h3>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{result.step}</h4>
                      <div className="text-sm text-gray-600">
                        {typeof result.result === 'string' ? (
                          result.result.startsWith('data:') ? (
                            <div>
                              <p className="mb-2">Audio generated successfully</p>
                              <audio controls>
                                <source src={result.result} type="audio/mpeg" />
                              </audio>
                            </div>
                          ) : result.result.startsWith('http') ? (
                            <div>
                              <p className="mb-2">Image generated:</p>
                              <img src={result.result} alt="Generated" className="max-w-xs rounded-lg" />
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{result.result}</p>
                          )
                        ) : (
                          <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                            {JSON.stringify(result.result, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowBuilder;
