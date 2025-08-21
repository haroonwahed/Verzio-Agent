import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, Plus, Trash2, Edit } from 'lucide-react';

/**
 * WolleysPanel allows users to create and manage "Wolleys" – AI co‑workers with
 * custom instructions. Each Wolley has a name and a set of instructions. Users
 * can create, edit or delete Wolleys. All API calls are authenticated via
 * axios defaults from AuthContext.
 */
function WolleysPanel({ onChatClick }) {
  const [wolleys, setWolleys] = useState([]);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing Wolleys on mount
  useEffect(() => {
    fetchWolleys();
  }, []);

  async function fetchWolleys() {
    try {
      const res = await axios.get('/wolleys');
      setWolleys(res.data.wolleys || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/wolleys/${editingId}`, { name, instructions });
      } else {
        await axios.post('/wolleys', { name, instructions });
      }
      setName('');
      setInstructions('');
      setEditingId(null);
      fetchWolleys();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(wolley) {
    setEditingId(wolley.id);
    setName(wolley.name);
    setInstructions(wolley.instructions);
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this Wolley?')) return;
    try {
      await axios.delete(`/wolleys/${id}`);
      fetchWolleys();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
            placeholder="e.g. Research Assistant"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-primary"
            rows="4"
            placeholder="Describe what this Wolley should do and how it should behave"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          disabled={loading}
        >
          {editingId ? (loading ? 'Updating...' : 'Update Wolley') : loading ? 'Creating...' : 'Create Wolley'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName('');
              setInstructions('');
            }}
            className="ml-2 px-4 py-2 rounded-md border border-gray-300"
          >
            Cancel
          </button>
        )}
      </form>
      <hr className="my-4" />
      <h3 className="text-lg font-semibold">Your Wolleys</h3>
      {wolleys.length === 0 && <p className="text-gray-500">No Wolleys yet.</p>}
      <ul className="space-y-2">
        {wolleys.map((wolley) => (
          <li key={wolley.id} className="border rounded-md p-3 flex justify-between items-start">
            <div>
              <h4 className="font-medium">{wolley.name}</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{wolley.instructions}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onChatClick && onChatClick(wolley)}
                className="text-green-600 hover:underline"
              >
                Chat
              </button>
              <button
                onClick={() => handleEdit(wolley)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(wolley.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WolleysPanel;