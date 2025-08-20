
const { db } = require('../db');

// Get all library items for a user
async function getLibraryItems(req, res) {
  try {
    const stmt = db.prepare('SELECT * FROM library_items WHERE user_id = ? ORDER BY created_at DESC');
    const items = stmt.all(req.user.id);
    res.json({ items });
  } catch (error) {
    console.error('Error fetching library items:', error);
    res.status(500).json({ error: 'Failed to fetch library items' });
  }
}

// Delete a library item
async function deleteLibraryItem(req, res) {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM library_items WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting library item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

// Save content to library
async function saveToLibrary(req, res) {
  try {
    const { title, content, type } = req.body;
    
    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO library_items (user_id, title, content, type, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);
    
    const result = stmt.run(req.user.id, title, content, type);
    
    res.json({ 
      id: result.lastInsertRowid,
      message: 'Content saved to library' 
    });
  } catch (error) {
    console.error('Error saving to library:', error);
    res.status(500).json({ error: 'Failed to save to library' });
  }
}

module.exports = { getLibraryItems, deleteLibraryItem, saveToLibrary };
