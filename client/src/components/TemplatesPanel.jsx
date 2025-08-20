
import React, { useState } from 'react';
import { FileText, Copy, Edit3, Zap } from 'lucide-react';
import axios from 'axios';

function TemplatesPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customInputs, setCustomInputs] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      id: 'blog-post',
      name: 'Blog Post',
      description: 'Create engaging blog posts',
      category: 'Content',
      inputs: [
        { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., AI in Marketing' },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Friendly', 'Authoritative'] },
        { name: 'length', label: 'Length', type: 'select', options: ['Short (300 words)', 'Medium (600 words)', 'Long (1000+ words)'] }
      ],
      prompt: 'Write a {{tone}} blog post about {{topic}}. The post should be {{length}}.'
    },
    {
      id: 'product-description',
      name: 'Product Description',
      description: 'Compelling product descriptions',
      category: 'E-commerce',
      inputs: [
        { name: 'product', label: 'Product Name', type: 'text', placeholder: 'e.g., Wireless Headphones' },
        { name: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List key features...' },
        { name: 'target', label: 'Target Audience', type: 'text', placeholder: 'e.g., Young professionals' }
      ],
      prompt: 'Write a compelling product description for {{product}} targeting {{target}}. Key features: {{features}}'
    },
    {
      id: 'social-media',
      name: 'Social Media Post',
      description: 'Engaging social media content',
      category: 'Social Media',
      inputs: [
        { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'] },
        { name: 'message', label: 'Key Message', type: 'text', placeholder: 'What do you want to communicate?' },
        { name: 'hashtags', label: 'Include Hashtags', type: 'checkbox' }
      ],
      prompt: 'Create a {{platform}} post about {{message}}{{hashtags ? " with relevant hashtags" : ""}}'
    },
    {
      id: 'email-campaign',
      name: 'Email Campaign',
      description: 'Professional email marketing',
      category: 'Marketing',
      inputs: [
        { name: 'subject', label: 'Email Subject', type: 'text', placeholder: 'e.g., Limited Time Offer' },
        { name: 'goal', label: 'Campaign Goal', type: 'select', options: ['Sales', 'Newsletter', 'Event Promotion', 'Re-engagement'] },
        { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Describe your audience...' }
      ],
      prompt: 'Write an email campaign for {{goal}} with subject "{{subject}}" targeting {{audience}}'
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  const handleInputChange = (inputName, value) => {
    setCustomInputs(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  const generateFromTemplate = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      let prompt = selectedTemplate.prompt;
      
      // Replace placeholders with actual values
      selectedTemplate.inputs.forEach(input => {
        const value = customInputs[input.name] || '';
        prompt = prompt.replace(new RegExp(`{{${input.name}}}`, 'g'), value);
      });

      const response = await axios.post('/api/text/generate', { prompt });
      setGeneratedContent(response.data.text);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <div className="h-full flex">
      {/* Templates List */}
      <div className="w-1/3 border-r border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Templates</h3>
        
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
            <div className="space-y-2">
              {templates.filter(t => t.category === category).map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-gray-900">{template.name}</h5>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Template Configuration */}
      <div className="flex-1 p-6">
        {selectedTemplate ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h3>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>

            <div className="space-y-4">
              {selectedTemplate.inputs.map(input => (
                <div key={input.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {input.label}
                  </label>
                  {input.type === 'text' && (
                    <input
                      type="text"
                      placeholder={input.placeholder}
                      value={customInputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  {input.type === 'textarea' && (
                    <textarea
                      placeholder={input.placeholder}
                      value={customInputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  {input.type === 'select' && (
                    <select
                      value={customInputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select {input.label}</option>
                      {input.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {input.type === 'checkbox' && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customInputs[input.name] || false}
                        onChange={(e) => handleInputChange(input.name, e.target.checked)}
                        className="mr-2"
                      />
                      {input.label}
                    </label>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={generateFromTemplate}
              disabled={loading}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Generating...' : 'Generate Content'}</span>
            </button>

            {generatedContent && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Generated Content</h4>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{generatedContent}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p>Select a template to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplatesPanel;
