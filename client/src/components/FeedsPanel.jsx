import React, { useState } from 'react';
import axios from 'axios';

/*
 * Panel for the "Verzio Feeds" feature.  Users can enter multiple product
 * names (or titles with optional details separated by commas) separated by
 * newlines.  On submit, the panel will request the server to generate
 * persuasive product descriptions based on Cialdini’s neuromarketing principles.
 */
function FeedsPanel() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseInput = () => {
    return input
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // If a line contains a comma, treat the part after the first comma as description
        const [title, ...rest] = line.split(',');
        const description = rest.join(',').trim();
        return rest.length > 0 ? { title: title.trim(), description } : title.trim();
      });
  };

  const handleGenerate = async () => {
    const items = parseInput();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/feeds/generate', { items });
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-700">
        Enter one product per line.  You can optionally provide additional details after a comma.
      </p>
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Example:\niPhone 15 Pro\nNike Air Max shoes, comfortable running shoes for daily training"
      />
      <button
        onClick={handleGenerate}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Descriptions'}
      </button>
      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((r, idx) => (
            <div key={idx} className="border p-3 rounded-md bg-gray-50">
              <p className="font-semibold mb-2">{typeof r.input === 'string' ? r.input : r.input.title}</p>
              {r.error ? (
                <p className="text-red-600">Error: {r.error}</p>
              ) : (
                <p className="whitespace-pre-wrap">{r.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedsPanel;