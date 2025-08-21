import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as Tabs from '@radix-ui/react-tabs';
import TextPanel from '../components/TextPanel';
import ImagePanel from '../components/ImagePanel';
import VoicePanel from '../components/VoicePanel';
import SeoPanel from '../components/SeoPanel';
import WorkflowBuilder from '../components/WorkflowBuilder';
import FeedsPanel from '../components/FeedsPanel';
import WolleysPanel from '../components/WolleysPanel';
import WolleyChat from '../components/WolleyChat';
import ProfileSettings from '../components/ProfileSettings';
import { LogOut, Type, Image, Mic, Search, Workflow, Rss, Layers, User, MessageCircle } from 'lucide-react';

function Dashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('text');
  const [selectedWolleyForChat, setSelectedWolleyForChat] = useState(null);

  const handleChatClick = (wolley) => {
    setSelectedWolleyForChat(wolley);
    setActiveTab('wolley-chat');
  };

  const tabs = [
    { id: 'text', label: 'Text', icon: Type, component: TextPanel },
    { id: 'image', label: 'Image', icon: Image, component: ImagePanel },
    { id: 'voice', label: 'Voice', icon: Mic, component: VoicePanel },
    { id: 'seo', label: 'SEO', icon: Search, component: SeoPanel },
    { id: 'workflows', label: 'Workflows', icon: Workflow, component: WorkflowBuilder },
    { id: 'feeds', label: 'Feeds', icon: Rss, component: FeedsPanel },
    { id: 'wolleys', label: 'Wolleys', icon: Layers, component: WolleysPanel, props: { onChatClick: handleChatClick } },
    { id: 'wolley-chat', label: 'Wolley Chat', icon: MessageCircle, component: WolleyChat, props: { preSelectedWolley: selectedWolleyForChat } },
    { id: 'profile', label: 'Profile', icon: User, component: ProfileSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Verzio</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab List */}
          <Tabs.List className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200 mb-8">
            {tabs.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab Content */}
          {tabs.map((tab) => (
            <Tabs.Content key={tab.id} value={tab.id} className="focus:outline-none">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <tab.component {...(tab.props || {})} />
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
}

export default Dashboard;