import React, { useState } from 'react';
import axios from 'axios';

function SeoPanel() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/seo/analyze', { content });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={handleAnalyze}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze SEO'}
      </button>
      {result && (
        <div className="mt-4 space-y-2">
          <div>
            <span className="font-semibold">Readability Score:</span> {result.readability?.toFixed(1)}
          </div>
          <div>
            <span className="font-semibold">Meta Description:</span> {result.meta?.description}
          </div>
          <div>
            <span className="font-semibold">Keywords:</span> {result.meta?.keywords?.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

export default SeoPanel;