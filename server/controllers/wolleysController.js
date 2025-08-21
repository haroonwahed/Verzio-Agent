const { createWolley, getWolleysByUser, updateWolley, deleteWolley, saveChatMessage, getChatHistory, clearChatHistory } = require('../db');

// Get all Wolleys for the authenticated user
async function listWolleys(req, res) {
  try {
    const userId = req.user.userId;
    const wolleys = await getWolleysByUser(userId);
    res.json({ wolleys });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Wolleys' });
  }
}

// Create a new Wolley
async function create(req, res) {
  try {
    const userId = req.user.userId;
    const { name, instructions } = req.body;
    if (!name || !instructions) {
      return res.status(400).json({ error: 'name and instructions are required' });
    }
    const wolley = await createWolley({ userId, name, instructions });
    res.json({ wolley });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Wolley' });
  }
}

// Update an existing Wolley
async function update(req, res) {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    const { name, instructions } = req.body;
    if (!name || !instructions) {
      return res.status(400).json({ error: 'name and instructions are required' });
    }
    const wolley = await updateWolley({ id, userId, name, instructions });
    res.json({ wolley });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Wolley' });
  }
}

// Delete a Wolley
async function remove(req, res) {
  try {
    const userId = req.user.userId;
    const id = parseInt(req.params.id, 10);
    await deleteWolley(id, userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete Wolley' });
  }
}

// Chat with a Wolley
async function chat(req, res) {
  try {
    const userId = req.user.userId;
    const { wolleyId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    // Get the Wolley to use its instructions
    const wolleys = await getWolleysByUser(userId);
    const wolley = wolleys.find(w => w.id === parseInt(wolleyId));
    
    if (!wolley) {
      return res.status(404).json({ error: 'Wolley not found' });
    }

    // Save user message to history
    await saveChatMessage({ 
      userId, 
      wolleyId: parseInt(wolleyId), 
      role: 'user', 
      content: message 
    });

    // Get chat history
    const chatHistory = await getChatHistory(userId, parseInt(wolleyId));

    // Prepare the messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are ${wolley.name}. ${wolley.instructions}\n\nPlease respond as this AI assistant would, following the given instructions carefully.`
      },
      ...chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ error: 'Failed to generate response' });
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    // Save assistant response to history
    await saveChatMessage({ 
      userId, 
      wolleyId: parseInt(wolleyId), 
      role: 'assistant', 
      content: assistantResponse 
    });

    res.json({ response: assistantResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to chat with Wolley' });
  }
}

// Get chat history for a Wolley
async function getChatHistoryForWolley(req, res) {
  try {
    const userId = req.user.userId;
    const wolleyId = parseInt(req.params.wolleyId);
    const history = await getChatHistory(userId, wolleyId);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}

// Clear chat history for a Wolley
async function clearChatHistoryForWolley(req, res) {
  try {
    const userId = req.user.userId;
    const wolleyId = parseInt(req.params.wolleyId);
    await clearChatHistory(userId, wolleyId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
}

module.exports = { listWolleys, create, update, remove, chat, getChatHistoryForWolley, clearChatHistoryForWolley };