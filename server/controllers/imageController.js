// Using built-in fetch available in Node.js 18+

// Generate an image from a text prompt using OpenAI DALL‑E 3
async function generateImage(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing' });
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: data.error?.message || 'Image generation failed' });
    }
    const imageUrl = data.data[0].url;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image generation failed' });
  }
}

// Placeholder for image editing functions (e.g. background removal or upscaling)
async function editImage(req, res) {
  // In a production environment you would forward the request to an image editing service
  // such as remove.bg for background removal or an upscaling API.  This is a stub.
  res.json({ message: 'Image editing not implemented yet', data: null });
}

module.exports = { generateImage, editImage };