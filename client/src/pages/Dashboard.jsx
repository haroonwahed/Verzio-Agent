
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, MessageSquare, Image, Mic, BarChart3, Rss, Workflow, Settings, LogOut, Plus, Sparkles, Layers } from 'lucide-react';
import TextPanel from '../components/TextPanel';
import ImagePanel from '../components/ImagePanel';
import VoicePanel from '../components/VoicePanel';
import SeoPanel from '../components/SeoPanel';
import FeedsPanel from '../components/FeedsPanel';
import WorkflowBuilder from '../components/WorkflowBuilder';
import WolleysPanel from '../components/WolleysPanel';
import WolleyChat from '../components/WolleyChat';
import IntegrationsPanel from '../components/IntegrationsPanel';
import ProfileSettings from '../components/ProfileSettings';

function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPanel, setCurrentPanel] = useState('text');
  const [selectedWolley, setSelectedWolley] = useState(null);

  const sidebarItems = [
    { id: 'text', label: 'Generate Text', icon: MessageSquare, color: 'text-purple-600' },
    { id: 'image', label: 'Generate Images', icon: Image, color: 'text-blue-600' },
    { id: 'voice', label: 'Generate Voice', icon: Mic, color: 'text-indigo-600' },
    { id: 'seo', label: 'SEO Analysis', icon: BarChart3, color: 'text-violet-600' },
    { id: 'feeds', label: 'Product Feeds', icon: Rss, color: 'text-purple-500' },
    { id: 'integrations', label: 'Integrations', icon: Layers, color: 'text-green-600' },
  ];

  const handleWolleyChat = (wolley) => {
    setSelectedWolley(wolley);
    setCurrentPanel('wolley-chat');
  };

  const renderContent = () => {
    if (currentPanel === 'wolley-chat' && selectedWolley) {
      return <WolleyChat selectedWolley={selectedWolley} onBack={() => setCurrentPanel('wolleys')} />;
    }

    switch (currentPanel) {
      case 'text': return <TextPanel />;
      case 'image': return <ImagePanel />;
      case 'voice': return <VoicePanel />;
      case 'seo': return <SeoPanel />;
      case 'feeds': return <FeedsPanel />;
      case 'integrations': return <IntegrationsPanel />;
      case 'workflows': return <WorkflowBuilder />;
      case 'wolleys': return <WolleysPanel onChatClick={handleWolleyChat} />;
      case 'settings': return <ProfileSettings />;
      default: return <TextPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-50 to-blue-50 border-r border-purple-100 shadow-lg z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-7 h-7 relative">
                {/* Modern brain-like logo */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
                    <path fill="currentColor" d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.3 11 5.6V7C11 7.6 11.4 8 12 8S13 7.6 13 8V5.6C13.6 5.3 14 4.7 14 4C14 2.9 13.1 2 12 2M8.5 6C7.1 6 6 7.1 6 8.5S7.1 11 8.5 11C9.3 11 10 10.6 10.4 10H11V12C11 12.6 11.4 13 12 13S13 12.6 13 12V10H13.6C14 10.6 14.7 11 15.5 11C16.9 11 18 9.9 18 8.5S16.9 6 15.5 6C15.1 6 14.7 6.1 14.4 6.3C14.1 6.1 13.7 6 13.3 6H10.7C10.3 6 9.9 6.1 9.6 6.3C9.3 6.1 8.9 6 8.5 6M7 14C5.9 14 5 14.9 5 16S5.9 18 7 18C7.4 18 7.8 17.9 8.1 17.7C8.4 17.9 8.8 18 9.2 18H14.8C15.2 18 15.6 17.9 15.9 17.7C16.2 17.9 16.6 18 17 18C18.1 18 19 17.1 19 16S18.1 14 17 14C16.6 14 16.2 14.1 15.9 14.3C15.6 14.1 15.2 14 14.8 14H9.2C8.8 14 8.4 14.1 8.1 14.3C7.8 14.1 7.4 14 7 14M10 20C10 21.1 10.9 22 12 22S14 21.1 14 20C14 19.3 13.6 18.7 13 18.4V17H11V18.4C10.4 18.7 10 19.3 10 20Z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Creeator</h1>
              <p className="text-xs text-gray-500">AI Content Studio</p>
            </div>
          </div>
        </div>

        {/* Search and Quick Access */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search or ask anything..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Quick Access Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPanel('workflows')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                currentPanel === 'workflows' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Workflows</span>
            </button>
            <button
              onClick={() => setCurrentPanel('wolleys')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                currentPanel === 'wolleys' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Agents</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPanel(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-100 bg-gradient-to-b from-purple-50 to-blue-50">
          <button
            onClick={() => setCurrentPanel('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
              currentPanel === 'settings' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 hover:bg-gray-100 rounded"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
