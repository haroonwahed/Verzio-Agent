import React, { useState } from 'react';
import axios from 'axios';
import { Image, Download, Sparkles, Wand2, Palette, RefreshCw, Grid } from 'lucide-react';

function ImagePanel() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const stylePresets = [
    { name: 'Photorealistic', style: 'photorealistic, highly detailed, professional photography' },
    { name: 'Digital Art', style: 'digital art, concept art, trending on artstation' },
    { name: 'Oil Painting', style: 'oil painting, classic art style, brush strokes' },
    { name: 'Watercolor', style: 'watercolor painting, soft colors, artistic' },
    { name: 'Cartoon', style: 'cartoon style, colorful, playful illustration' },
    { name: 'Minimalist', style: 'minimalist design, clean, simple, modern' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/image/generate', { prompt });
      setImages([{ url: res.data.imageUrl, prompt }, ...images]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url, imagePrompt) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `verzio-image-${imagePrompt.slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const useStylePreset = (style) => {
    const currentPrompt = prompt.replace(/, (photorealistic|digital art|oil painting|watercolor|cartoon|minimalist).*?(?=,|$)/gi, '');
    setPrompt(`${currentPrompt.trim()}, ${style}`);
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Image Generation</h1>
              <p className="text-gray-600">Create stunning visuals with DALL-E 3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Art Styles</h2>
              <div className="grid grid-cols-2 gap-2">
                {stylePresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => useStylePreset(preset.style)}
                    className="p-2 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-2">
                      <Palette className="w-3 h-3 text-gray-500 group-hover:text-purple-600" />
                      <span className="font-medium text-xs text-gray-900">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Describe your image
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  placeholder="A majestic mountain landscape at sunset with snow-capped peaks..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Generated Images</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Grid className="w-4 h-4" />
                <span>{images.length} image{images.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {images.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No images generated yet</h3>
                <p className="text-gray-600">Enter a description and click generate to create your first image</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{image.prompt}</p>
                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagePanel;