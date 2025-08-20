
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

function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs = [
    { id: 'text', label: 'Text Generation', icon: '📝', component: TextPanel },
    { id: 'image', label: 'Image Creation', icon: '🎨', component: ImagePanel },
    { id: 'voice', label: 'Voice Synthesis', icon: '🎤', component: VoicePanel },
    { id: 'seo', label: 'SEO Analysis', icon: '📊', component: SeoPanel },
    { id: 'workflow', label: 'Workflows', icon: '⚡', component: WorkflowBuilder },
    { id: 'feeds', label: 'Bulk Content', icon: '📦', component: FeedsPanel },
    { id: 'wolleys', label: 'AI Co-Workers', icon: '🤖', component: WolleysPanel },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            {sidebarOpen && <span className="text-xl font-bold text-gray-900">Verzio</span>}
          </div>
        </div>

        {/* Navigation */}
        <Tabs.Root defaultValue="text" className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Tabs.List className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={`
                    flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-left transition-colors
                    hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500
                    data-[state=active]:text-white data-[state=active]:shadow-lg
                    ${!sidebarOpen ? 'justify-center' : ''}
                  `}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {sidebarOpen && (
                    <div>
                      <div className="font-medium">{tab.label}</div>
                    </div>
                  )}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </Tabs.Root>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">AI Content Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V17zm0 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h8z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Tabs.Root defaultValue="text" className="h-full">
            {tabs.map((tab) => {
              const Component = tab.component;
              return (
                <Tabs.Content key={tab.id} value={tab.id} className="h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                    <Component />
                  </div>
                </Tabs.Content>
              );
            })}
          </Tabs.Root>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
