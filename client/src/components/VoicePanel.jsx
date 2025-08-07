import React, { useState } from 'react';
import axios from 'axios';

function VoicePanel() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('nova');
  const [audioSrc, setAudioSrc] = useState('');
  const [loading, setLoading] = useState(false);

  const voices = [
    { value: 'nova', label: 'Nova (default)' },
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'shimmer', label: 'Shimmer' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/voice/synthesize', { text, voice });
      const base64 = res.data.audio;
      const src = `data:audio/mp3;base64,${base64}`;
      setAudioSrc(src);
    } catch (err) {
      console.error(err);
      setAudioSrc('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Text to Synthesize</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Voice</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          {voices.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleGenerate}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Synthesizing...' : 'Generate Voice'}
      </button>
      {audioSrc && (
        <div className="mt-4">
          <audio controls src={audioSrc}></audio>
        </div>
      )}
    </div>
  );
}

export default VoicePanel;