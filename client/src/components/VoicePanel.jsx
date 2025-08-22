import React, { useState } from 'react';
import axios from 'axios';
import { Mic, Download, Play, Square } from 'lucide-react';

function VoicePanel() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const voices = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'nova', name: 'Nova' },
    { id: 'shimmer', name: 'Shimmer' }
  ];

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/voice/generate', { text, voice });
      setAudioUrl(res.data.audioUrl);
    } catch (err) {
      console.error('Voice generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Mic className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">Voice Generation</h2>
      </div>

      <div className="two-pane grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="panel bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text to Convert
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="btn-primary w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="panel bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Generated Audio</h3>

          {audioUrl ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handlePlay}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Stop' : 'Play'}</span>
                </button>

                <a
                  href={audioUrl}
                  download="generated-speech.mp3"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Generate speech from text to see the audio player here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoicePanel;