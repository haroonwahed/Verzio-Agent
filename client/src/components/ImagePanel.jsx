
import React, { useState } from 'react';
import axios from 'axios';

function ImagePanel() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('natural');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sizeOptions = [
    { value: '256x256', label: 'Small (256×256)' },
    { value: '512x512', label: 'Medium (512×512)' },
    { value: '1024x1024', label: 'Large (1024×1024)' }
  ];

  const styleOptions = [
    { value: 'natural', label: 'Natural' },
    { value: 'vivid', label: 'Vivid' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/image/generate', {
        prompt: prompt.trim(),
        size,
        style
      });
      
      const newImage = {
        id: Date.now(),
        url: response.data.url,
        prompt: prompt.trim(),
        size,
        style,
        timestamp: new Date().toLocaleString()
      };
      
      setImages(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url, prompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `verzio-image-${prompt.slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🎨</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Image Generation</h2>
            <p className="text-sm text-gray-600">Create stunning visuals with AI</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Generation Form */}
          <div className="bg-gray-50 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create... (e.g., 'A futuristic cityscape at sunset with flying cars')"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {styleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Image...</span>
                  </div>
                ) : (
                  'Generate Image'
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Prompts */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Prompts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Abstract geometric art',
                'Minimalist logo design',
                'Nature landscape',
                'Modern architecture',
                'Digital art portrait',
                'Sci-fi concept art',
                'Vintage poster style',
                'Watercolor painting'
              ].map((quickPrompt) => (
                <button
                  key={quickPrompt}
                  onClick={() => setPrompt(quickPrompt)}
                  className="text-left p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Images Gallery */}
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.prompt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{image.size}</span>
                        <span>{image.timestamp}</span>
                      </div>
                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images generated yet</h3>
              <p className="text-gray-600">Create your first AI-generated image by describing what you want to see</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImagePanel;
