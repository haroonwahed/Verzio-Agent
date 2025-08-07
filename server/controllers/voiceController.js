const fetch = require('node-fetch');

// Synthesize speech from text.  Accepts { text: string, voice: string }
// Available voices vary by provider; default is 'nova'.  Response returns a base64 encoded MP3.
async function synthesizeVoice(req, res) {
  const { text, voice = 'nova' } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing' });
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice,
        input: text,
        response_format: 'mp3',
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      console.error(data);
      return res.status(500).json({ error: data?.error?.message || 'Voice synthesis failed' });
    }
    // OpenAI returns binary audio; convert to base64
    const buffer = await response.buffer();
    const base64Audio = buffer.toString('base64');
    res.json({ audio: base64Audio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Voice synthesis failed' });
  }
}

module.exports = { synthesizeVoice };