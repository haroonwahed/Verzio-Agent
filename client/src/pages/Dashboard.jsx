
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, MessageSquare, Image, Mic, BarChart3, Rss, Workflow, Settings, LogOut, Plus, Sparkles } from 'lucide-react';
import TextPanel from '../components/TextPanel';
import ImagePanel from '../components/ImagePanel';
import VoicePanel from '../components/VoicePanel';
import SeoPanel from '../components/SeoPanel';
import FeedsPanel from '../components/FeedsPanel';
import WorkflowBuilder from '../components/WorkflowBuilder';
import WolleysPanel from '../components/WolleysPanel';
import WolleyChat from '../components/WolleyChat';
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
    { id: 'workflows', label: 'Workflow Builder', icon: Workflow, color: 'text-blue-500' },
    { id: 'wolleys', label: 'AI Agents', icon: Bot, color: 'text-indigo-500' },
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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-purple-600 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Verzio</h1>
              <p className="text-xs text-gray-500">AI Content Studio</p>
            </div>
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
