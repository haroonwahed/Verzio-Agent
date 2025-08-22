
import React, { useState, useEffect, useRef } from 'react';
import { User, FileText, Image, Mic, Settings, BarChart, BarChart3, Plus, Search, Grid, List, Filter, MessageSquare, Wand2, Workflow, Rss, BookOpen, HelpCircle, ExternalLink, Bell, LogOut, Bot, Layers, Calendar, Activity, Command, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppShell from '../components/AppShell';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
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
  const [currentPanel, setCurrentPanel] = useState('dashboard');
  const [selectedWolley, setSelectedWolley] = useState(null);

  // Placeholder for notification state management
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [activePanel, setActivePanel] = useState('dashboard');

  const sidebarItems = [
    { id: 'text', label: 'Generate Text', icon: MessageSquare, color: 'text-purple-600', category: 'creator' },
    { id: 'image', label: 'Generate Images', icon: Image, color: 'text-blue-600', category: 'creator' },
    { id: 'voice', label: 'Generate Voice', icon: Mic, color: 'text-indigo-600', category: 'creator' },
    { id: 'seo', label: 'SEO Analysis', icon: BarChart3, color: 'text-violet-600', category: 'creator' },
    { id: 'crews', label: 'Crews', icon: Bot, color: 'text-cyan-500', category: 'creator' },
    { id: 'workflows', label: 'Workflows', icon: Workflow, color: 'text-pink-500', category: 'creator' },
    { id: 'feeds', label: 'Product Feeds', icon: Rss, color: 'text-purple-500', category: 'management' },
    { id: 'integrations', label: 'Integrations', icon: Layers, color: 'text-green-600', category: 'management' },
    { id: 'settings', label: 'Profile Settings', icon: Settings, color: 'text-red-500', category: 'management' },
  ];

  const resourceItems = [
    { id: 'docs', label: 'Documentation', icon: BookOpen, href: '/docs', external: false },
    { id: 'changelog', label: 'Changelog', icon: Activity, href: '/changelog', external: false },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Command, action: () => setShowCommandPalette(true) },
    { id: 'status', label: 'Status', icon: TrendingUp, href: '/status', external: false },
    { id: 'contact', label: 'Contact', icon: HelpCircle, href: '/contact', external: false },
  ];

  const handleWolleyChat = (wolley) => {
    setSelectedWolley(wolley);
    setCurrentPanel('wolley-chat');
  };

  // Dashboard card components
  const WelcomeCard = ({ className }) => (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h3>
          <p className="text-sm text-[var(--muted)]">Ready to create amazing content?</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Today's Usage</span>
          <span className="text-sm font-medium">12/100 requests</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[var(--brand-500)] h-2 rounded-full" style={{ width: '12%' }}></div>
        </div>
      </div>
    </Card>
  );

  const LatestActivity = ({ className }) => (
    <Card className={`${className}`}>
      <SectionTitle>Latest Activity</SectionTitle>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Blog post draft completed</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Crew run started</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600">Workflow executed</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600">Image generated</span>
        </div>
      </div>
    </Card>
  );

  const CalendarPeek = ({ className }) => (
    <Card className={`${className}`}>
      <SectionTitle>This Week</SectionTitle>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Today</span>
          <span className="text-[var(--brand-600)] font-medium">3 tasks</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tomorrow</span>
          <span className="text-gray-400">1 task</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Friday</span>
          <span className="text-gray-400">2 tasks</span>
        </div>
      </div>
    </Card>
  );

  const ChatWithCrew = ({ className }) => (
    <Card className={`${className}`}>
      <SectionTitle>Favorite Crews</SectionTitle>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Blog Writer</span>
          </div>
          <button className="px-3 py-1 bg-[var(--brand-100)] text-[var(--brand-700)] rounded-lg text-xs font-medium">
            Run
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium">SEO Analyst</span>
          </div>
          <button className="px-3 py-1 bg-[var(--brand-100)] text-[var(--brand-700)] rounded-lg text-xs font-medium">
            Run
          </button>
        </div>
      </div>
    </Card>
  );

  const RecentTools = ({ className }) => (
    <Card className={`${className}`}>
      <SectionTitle>Recently Used</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2 text-sm">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          <span className="text-gray-600">Text Gen</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Image className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600">Images</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Bot className="w-4 h-4 text-cyan-500" />
          <span className="text-gray-600">Crews</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <BarChart3 className="w-4 h-4 text-violet-500" />
          <span className="text-gray-600">SEO</span>
        </div>
      </div>
    </Card>
  );

  const UsageChart = ({ className }) => (
    <Card className={`${className}`}>
      <SectionTitle>Usage This Week</SectionTitle>
      <div className="h-24 bg-gradient-to-r from-[var(--brand-100)] to-[var(--brand-200)] rounded-lg flex items-end justify-center p-4">
        <div className="flex items-end space-x-2">
          {[20, 35, 25, 45, 30, 40, 55].map((height, i) => (
            <div
              key={i}
              className="w-4 bg-[var(--brand-500)] rounded-t"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderActivePanel = () => {
    if (currentPanel === 'wolley-chat' && selectedWolley) {
      return <WolleyChat selectedWolley={selectedWolley} onBack={() => setCurrentPanel('crews')} />;
    }

    switch (activePanel) {
      case 'dashboard':
        return (
          <div className="px-8 py-6 space-y-[var(--gap-lg)]">
            <div className="grid grid-cols-12 gap-[var(--gap)]">
              <WelcomeCard className="col-span-12 xl:col-span-5" />
              <LatestActivity className="col-span-12 sm:col-span-6 xl:col-span-3" />
              <CalendarPeek className="col-span-12 sm:col-span-6 xl:col-span-4" />
              <ChatWithCrew className="col-span-12 md:col-span-6 xl:col-span-4" />
              <RecentTools className="col-span-12 md:col-span-6 xl:col-span-4" />
              <UsageChart className="col-span-12 xl:col-span-4" />
            </div>
            <footer className="text-sm text-[var(--muted)] border-t border-[var(--border)] pt-4">
              © 2025 Creeator · <a className="link" href="/changelog">Changelog</a> · <a className="link" href="/privacy">Privacy</a>
            </footer>
          </div>
        );
      case 'text': return <TextPanel />;
      case 'image': return <ImagePanel />;
      case 'voice': return <VoicePanel />;
      case 'seo': return <SeoPanel />;
      case 'feeds': return <FeedsPanel />;
      case 'integrations': return <IntegrationsPanel />;
      case 'workflows': return <WorkflowBuilder />;
      case 'crews': return <WolleysPanel onChatClick={handleWolleyChat} />;
      case 'settings': return <ProfileSettings />;
      default: return <TextPanel />;
    }
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/brand/creeator-mark.svg" alt="Creeator" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Creeator</span>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Dashboard */}
          <div>
            <button
              onClick={() => setActivePanel('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors mb-4 ${
                activePanel === 'dashboard'
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>
          </div>

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
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {(item.id === 'crews' || item.id === 'workflows') && (
                    <span className="ml-auto px-2 py-0.5 bg-[var(--brand-600)] text-white text-xs rounded-full">
                      New
                    </span>
                  )}
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
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
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
              {resourceItems.map((item) => (
                item.action ? (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ) : item.external ? (
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
      <div className="p-6 border-t border-[var(--border)]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[var(--brand-500)] rounded-full flex items-center justify-center">
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
      <AppShell sidebar={<div className="bg-white border-r border-[var(--border)] flex flex-col h-full">{sidebarContent}</div>}>
        {renderActivePanel()}
      </AppShell>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[10vh] z-50" onClick={() => setShowCommandPalette(false)}>
          <div className="bg-white rounded-lg shadow-xl border border-[var(--border)] w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center space-x-3">
                <Command className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="flex-1 border-none outline-none text-gray-900"
                  autoFocus
                />
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">esc</kbd>
              </div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Quick Actions</div>
                <button className="w-full px-3 py-2 text-left rounded hover:bg-gray-50 flex items-center space-x-3">
                  <Bot className="w-4 h-4" />
                  <span>Go to Crews</span>
                </button>
                <button className="w-full px-3 py-2 text-left rounded hover:bg-gray-50 flex items-center space-x-3">
                  <Workflow className="w-4 h-4" />
                  <span>Go to Workflows</span>
                </button>
                <button className="w-full px-3 py-2 text-left rounded hover:bg-gray-50 flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Generate Text</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Labs Floating Button */}
      <LabsFloatingButton />
    </>
  );
}

export default Dashboard;
