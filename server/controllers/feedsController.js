const fetch = require('node-fetch');

/*
 * Bulk product description generation for "Verzio Feeds".  The request body
 * should contain an array of items (strings or objects) under the `items`
 * property.  Each item will be used to craft a prompt for GPT‑4o.  The
 * endpoint returns an array of objects with the original input and the
 * generated description.
 */
async function generateFeeds(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing' });
  try {
    const results = [];
    for (const item of items) {
      // Derive a prompt from either a string or an object with name and optional details
      const prompt = typeof item === 'string'
        ? `Write a persuasive, SEO‑friendly product description for "${item}" using neuromarketing principles.`
        : `Write a persuasive, SEO‑friendly product description for "${item.title}"${item.description ? ` based on this detail: ${item.description}` : ''} using neuromarketing principles.`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a marketing copywriter specialised in Cialdini’s principles such as reciprocity, scarcity and social proof. Generate short yet compelling descriptions.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(data);
        results.push({ input: item, error: data.error?.message || 'Generation failed' });
        continue;
      }
      const description = data.choices[0].message.content.trim();
      results.push({ input: item, description });
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feed generation failed' });
  }
}

module.exports = { generateFeeds };