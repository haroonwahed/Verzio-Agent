
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Bot, Download } from 'lucide-react';

/**
 * WolleyChat allows users to chat with their created Wolleys.
 * Users can select a Wolley and have a conversation where the AI
 * responds according to the Wolley's custom instructions.
 */
function WolleyChat({ preSelectedWolley }) {
  const [wolleys, setWolleys] = useState([]);
  const [selectedWolley, setSelectedWolley] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Wolleys on mount
  useEffect(() => {
    fetchWolleys();
  }, []);

  // Auto-select Wolley if preSelectedWolley is provided
  useEffect(() => {
    if (preSelectedWolley && !selectedWolley) {
      handleWolleySelect(preSelectedWolley);
    }
  }, [preSelectedWolley, selectedWolley]);

  async function fetchWolleys() {
    try {
      const res = await axios.get('/wolleys');
      setWolleys(res.data.wolleys || []);
    } catch (err) {
      console.error('Failed to fetch Wolleys:', err);
    }
  }

  async function handleWolleySelect(wolley) {
    setSelectedWolley(wolley);
    
    // Load chat history
    try {
      const response = await axios.get(`/wolleys/${wolley.id}/history`);
      const history = response.data.history || [];
      
      if (history.length === 0) {
        // First time chatting with this Wolley
        setMessages([
          {
            role: 'system',
            content: `Hello! I'm ${wolley.name}. ${wolley.instructions}`,
            timestamp: new Date()
          }
        ]);
      } else {
        // Load existing history
        setMessages(history.map(msg => ({
          ...msg,
          timestamp: new Date(msg.created_at)
        })));
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setMessages([
        {
          role: 'system',
          content: `Hello! I'm ${wolley.name}. ${wolley.instructions}`,
          timestamp: new Date()
        }
      ]);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedWolley || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/wolleys/chat', {
        wolleyId: selectedWolley.id,
        message: messageText
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        role: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    if (!selectedWolley || !window.confirm('Are you sure you want to clear all chat history with this Wolley?')) return;
    
    try {
      await axios.delete(`/wolleys/${selectedWolley.id}/history`);
      setMessages([
        {
          role: 'system',
          content: `Hello! I'm ${selectedWolley.name}. ${selectedWolley.instructions}`,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }

  function handleExportChat() {
    if (!selectedWolley || messages.length <= 1) return;

    const chatData = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toLocaleString()
      }));

    const exportData = {
      wolleyName: selectedWolley.name,
      exportDate: new Date().toLocaleString(),
      messages: chatData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedWolley.name}-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (wolleys.length === 0) {
    return (
      <div className="p-4 text-center">
        <Bot className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600">No Wolleys Available</h3>
        <p className="text-gray-500">Create a Wolley first to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {!selectedWolley ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select a Wolley to Chat With</h3>
          <div className="grid gap-3">
            {wolleys.map((wolley) => (
              <div
                key={wolley.id}
                onClick={() => handleWolleySelect(wolley)}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bot className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">{wolley.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {wolley.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{selectedWolley.name}</h3>
                <p className="text-sm text-gray-600">AI Assistant</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportChat}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 text-blue-600"
                disabled={messages.length <= 1}
              >
                <Download className="h-3 w-3 inline mr-1" />
                Export
              </button>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 text-red-600"
              >
                Clear History
              </button>
              <button
                onClick={() => setSelectedWolley(null)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
              >
                Back to Wolleys
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : message.role === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-gray-600">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default WolleyChat;
