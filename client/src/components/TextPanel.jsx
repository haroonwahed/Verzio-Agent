import React, { useState } from 'react';
import axios from 'axios';

function TextPanel() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/text/generate', { prompt, tone });
      setResult(res.data.content);
    } catch (err) {
      console.error(err);
      setResult(err.response?.data?.error || 'Error generating text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Prompt</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          rows="4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tone (optional)</label>
        <input
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="e.g. conversational, professional"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Text</h3>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}

export default TextPanel;