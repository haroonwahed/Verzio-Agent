const fetch = require('node-fetch');
const { saveWorkflow, getWorkflowById } = require('../db');

// Helper to resolve template placeholders from the workflow context
function resolveParams(obj, context) {
  if (!obj) return {};
  const resolved = {};
  for (const key of Object.keys(obj)) {
    let value = obj[key];
    if (typeof value === 'string') {
      value = value.replace(/\{\{(.*?)\}\}/g, (_, token) => {
        const trimmed = token.trim();
        return context[trimmed] || '';
      });
    }
    resolved[key] = value;
  }
  return resolved;
}

async function runStep(step, context) {
  const type = step.type;
  const params = resolveParams(step.params || {}, context);
  const apiKey = process.env.OPENAI_API_KEY;
  switch (type) {
    case 'text': {
      const { prompt, tone = '' } = params;
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
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Text generation failed');
      const content = data.choices[0].message.content.trim();
      return content;
    }
    case 'image': {
      const { prompt } = params;
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', response_format: 'url' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Image generation failed');
      return data.data[0].url;
    }
    case 'voice': {
      const { text, voice = 'nova' } = params;
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: 'tts-1', voice, input: text, response_format: 'mp3' }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error?.message || 'Voice synthesis failed');
      }
      const buffer = await response.buffer();
      return buffer.toString('base64');
    }
    case 'seo': {
      const { content } = params;
      // Calculate Flesch reading ease
      const sentences = content.split(/[.!?]/).filter(Boolean).length || 1;
      const words = content.split(/\s+/).filter(Boolean).length || 1;
      const syllables = content
        .toLowerCase()
        .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        .replace(/^y/, '')
        .match(/[aeiouy]{1,2}/g);
      const syllableCount = syllables ? syllables.length : 1;
      const readability = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllableCount / words);
      // Use OpenAI to generate meta tags if API key exists
      let meta = { description: '', keywords: [] };
      if (apiKey) {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'You are an SEO assistant. For the following content, generate a concise meta description (max 150 characters) and a list of keywords.' },
              { role: 'user', content },
            ],
          }),
        });
        const d = await resp.json();
        if (resp.ok) {
          const reply = d.choices[0].message.content;
          const [descLine, keywordsLine] = reply.split('\n');
          meta.description = descLine?.replace(/Meta description: /i, '').trim();
          meta.keywords = keywordsLine
            ?.replace(/Keywords?: /i, '')
            .split(/,\s*/)
            .map((kw) => kw.trim())
            .filter(Boolean);
        }
      }
      return { readability, meta };
    }
    default:
      throw new Error(`Unknown step type: ${type}`);
  }
}

// POST /api/workflows/save
async function saveWorkflowHandler(req, res) {
  try {
    const { name, definition } = req.body;
    if (!name || !definition) return res.status(400).json({ error: 'name and definition are required' });
    const workflow = await saveWorkflow({ userId: req.user.id, name, definition });
    res.json({ workflow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save workflow' });
  }
}

// POST /api/workflows/run
async function runWorkflowHandler(req, res) {
  try {
    const { id, definition } = req.body;
    let workflowDef = definition;
    if (id) {
      const wf = await getWorkflowById(id);
      if (!wf) return res.status(404).json({ error: 'Workflow not found' });
      workflowDef = wf.definition;
    }
    if (!workflowDef || !Array.isArray(workflowDef.steps)) {
      return res.status(400).json({ error: 'Invalid workflow definition' });
    }
    const context = {};
    const results = [];
    for (const step of workflowDef.steps) {
      const result = await runStep(step, context);
      // Store result in context using step.name or type as key
      const key = step.name || step.type;
      context[key] = result;
      results.push({ step: key, result });
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to run workflow' });
  }
}

module.exports = { saveWorkflowHandler, runWorkflowHandler };