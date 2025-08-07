import React, { useState } from 'react';
import axios from 'axios';

function ImagePanel() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/image/generate', { prompt });
      setImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Image Prompt</label>
        <input
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated" className="max-w-full h-auto rounded-md" />
        </div>
      )}
    </div>
  );
}

export default ImagePanel;