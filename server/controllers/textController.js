// Using built-in fetch available in Node.js 18+

/*
 * Generate text via OpenAI GPT‑4o.  The request body may include:
 *  - prompt: base string to send to GPT
 *  - tone: optional stylistic directive (e.g. "informal", "friendly", etc.)
 * The endpoint responds with { content: "generated text" } on success.
 */
async function generateText(req, res) {
  const { prompt, tone = '' } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing' });
    const systemPrompt = tone
      ? `You are a helpful AI writer. Please write in a ${tone} tone.`
      : 'You are a helpful AI writer.';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: data.error?.message || 'OpenAI request failed' });
    }
    const content = data.choices[0].message.content.trim();
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Text generation failed' });
  }
}

module.exports = { generateText };