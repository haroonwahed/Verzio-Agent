import React, { useState, useEffect, useRef } from 'react';
import { User, FileText, Image, Mic, Settings, BarChart, Plus, Search, Grid, List, Filter, MessageSquare, Wand2, Workflow, Rss, BookOpen, HelpCircle, ExternalLink, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppShell from '../components/AppShell';
import TextPanel from '../components/TextPanel';
import ImagePanel from '../components/ImagePanel';
import VoicePanel from '../components/VoicePanel';
import WolleysPanel from '../components/WolleysPanel';
import SeoPanel from '../components/SeoPanel';
import ProfileSettings from '../components/ProfileSettings';
import IntegrationsPanel from '../components/IntegrationsPanel';
import FeedsPanel from '../components/FeedsPanel';
import LabsFloatingButton from '../components/LabsFloatingButton';

function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPanel, setCurrentPanel] = useState('text');
  const [selectedWolley, setSelectedWolley] = useState(null);

  // Placeholder for notification state management (replace with actual context/state)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]); // Example: [{ id: 1, title: 'New Feature', message: '...', read: false, created_at: ... }]
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Placeholder for active panel state management in the new structure
  const [activePanel, setActivePanel] = useState('text');


  const sidebarItems = [
    { id: 'text', label: 'Generate Text', icon: MessageSquare, color: 'text-purple-600', category: 'creator' },
    { id: 'image', label: 'Generate Images', icon: Image, color: 'text-blue-600', category: 'creator' },
    { id: 'voice', label: 'Generate Voice', icon: Mic, color: 'text-indigo-600', category: 'creator' },
    { id: 'seo', label: 'SEO Analysis', icon: BarChart3, color: 'text-violet-600', category: 'creator' },
    { id: 'feeds', label: 'Product Feeds', icon: Rss, color: 'text-purple-500', category: 'management' },
    { id: 'integrations', label: 'Integrations', icon: Layers, color: 'text-green-600', category: 'management' },
    { id: 'workflows', label: 'Workflows', icon: Workflow, color: 'text-pink-500', category: 'management' },
    { id: 'wolleys', label: 'AI Agents', icon: Bot, color: 'text-cyan-500', category: 'creator' },
    { id: 'settings', label: 'Profile Settings', icon: Settings, color: 'text-red-500', category: 'management' },
    // Example for resources
    // { id: 'docs', label: 'Documentation', icon: BookOpen, href: '/docs', external: false, category: 'resources' },
    // { id: 'help', label: 'Help Center', icon: HelpCircle, href: 'https://help.creeator.ai', external: true, category: 'resources' },
  ];

  const handleWolleyChat = (wolley) => {
    setSelectedWolley(wolley);
    setCurrentPanel('wolley-chat');
  };

  const renderActivePanel = () => {
    if (currentPanel === 'wolley-chat' && selectedWolley) {
      return <WolleyChat selectedWolley={selectedWolley} onBack={() => setCurrentPanel('wolleys')} />;
    }

    switch (activePanel) { // Changed to activePanel for the new structure
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

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Verzio</span>
          </Link>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Creator Tools */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Creator Tools
            </h3>
            <div className="space-y-1">
              {sidebarItems.filter(item => item.category === 'creator').map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activePanel === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Management */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Management
            </h3>
            <div className="space-y-1">
              {sidebarItems.filter(item => item.category === 'management').map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activePanel === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Resources
            </h3>
            <div className="space-y-1">
              {sidebarItems.filter(item => item.category === 'resources').map((item) => (
                item.external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
          <button
            onClick={logout}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AppShell sidebar={<div className="bg-white border-r border-gray-200 flex flex-col h-full">{sidebarContent}</div>}>
        {renderActivePanel()}
      </AppShell>

      {/* Labs Floating Button */}
      <LabsFloatingButton />
    </>
  );
}

export default Dashboard;