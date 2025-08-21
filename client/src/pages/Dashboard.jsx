
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
    { id: 'text', label: 'Generate Text', icon: MessageSquare, color: 'text-blue-600' },
    { id: 'image', label: 'Generate Images', icon: Image, color: 'text-purple-600' },
    { id: 'voice', label: 'Generate Voice', icon: Mic, color: 'text-green-600' },
    { id: 'seo', label: 'SEO Analysis', icon: BarChart3, color: 'text-orange-600' },
    { id: 'feeds', label: 'Product Feeds', icon: Rss, color: 'text-red-600' },
    { id: 'workflows', label: 'Workflow Builder', icon: Workflow, color: 'text-indigo-600' },
    { id: 'wolleys', label: 'AI Agents', icon: Bot, color: 'text-cyan-600' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
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
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setCurrentPanel('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
              currentPanel === 'settings' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
