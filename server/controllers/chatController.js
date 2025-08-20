
const fetch = require('node-fetch');

async function chatMessage(req, res) {
  const { message, history = [] } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key missing' });
    }

    // Convert history to OpenAI format
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for Verzio, a content creation platform. Help users with content creation, marketing strategies, and general questions about AI-powered content tools.'
      },
      ...history.slice(-10).map(h => ({
        role: h.type === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Chat failed');
    }

    const aiMessage = data.choices[0].message.content;
    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
}

module.exports = { chatMessage };
