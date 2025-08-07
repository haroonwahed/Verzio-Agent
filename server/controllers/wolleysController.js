const { createWolley, getWolleysByUser, updateWolley, deleteWolley } = require('../db');

// Get all Wolleys for the authenticated user
async function listWolleys(req, res) {
  try {
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    await deleteWolley(id, userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete Wolley' });
  }
}

module.exports = { listWolleys, create, update, remove };