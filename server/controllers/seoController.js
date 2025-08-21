// Using built-in fetch available in Node.js 18+

// Calculate Flesch reading ease score
function fleschReadingEase(text) {
  const sentences = text.split(/[.!?]/).filter(Boolean).length || 1;
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const syllables = text
    .toLowerCase()
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g);
  const syllableCount = syllables ? syllables.length : 1;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllableCount / words);
  return Math.round(score * 10) / 10;
}

async function analyzeSEO(req, res) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });
  try {
    const readability = fleschReadingEase(content);
    let meta = { description: '', keywords: [] };
    // Optionally call OpenAI to generate meta tags
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an SEO assistant. For the following content, generate a concise meta description (max 150 characters) and a list of 5 to 8 relevant keywords.' },
            { role: 'user', content },
          ],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const reply = data.choices[0].message.content;
        // Expecting description and keywords separated by newline
        const [descriptionLine, keywordsLine] = reply.split('\n');
        meta.description = descriptionLine?.replace(/Meta description: /i, '').trim();
        meta.keywords = keywordsLine
          ?.replace(/Keywords?: /i, '')
          .split(/,\s*/)
          .map((kw) => kw.trim())
          .filter(Boolean);
      }
    }
    res.json({ readability, meta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'SEO analysis failed' });
  }
}

module.exports = { analyzeSEO };