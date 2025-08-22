import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Copy, Download, Sparkles, Wand2, FileText, RefreshCw } from 'lucide-react';

function TextPanel() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const promptTemplates = [
    { name: 'Blog Post', template: 'Write a comprehensive blog post about [topic] that includes an introduction, main points, and conclusion.' },
    { name: 'Product Description', template: 'Write a compelling product description for [product name] highlighting its key features and benefits.' },
    { name: 'Email Marketing', template: 'Create an engaging marketing email for [product/service] with a catchy subject line and call-to-action.' },
    { name: 'Social Media', template: 'Create engaging social media content for [platform] about [topic] that encourages interaction.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/text/generate', { prompt });
      setResult(res.data.text);
    } catch (err) {
      console.error(err);
      setResult('Error generating text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'verzio-text-output.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const useTemplate = (template) => {
    setPrompt(template);
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Text Generation</h1>
              <p className="text-gray-600">Generate high-quality content with advanced AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="space-y-6">
          <div className="two-pane grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="panel bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h2>
                <div className="grid grid-cols-2 gap-3">
                  {promptTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => useTemplate(template.template)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        <span className="font-medium text-sm text-gray-900">{template.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    What would you like me to write?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Describe what you want me to write about. Be as detailed as possible for better results..."
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !prompt.trim()}
                  className="btn-primary w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Section */}
            <div className="panel bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
                {result && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={downloadText}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                  {result ? (
                    <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                      {result}
                    </div>
                  ) : (
                    <div className="empty text-center py-12 text-gray-500">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-lg font-medium">Your generated content will appear here</p>
                      <p className="text-sm">Enter a prompt and click generate to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextPanel;