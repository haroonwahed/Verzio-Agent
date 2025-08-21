
import React, { useState } from 'react';
import { 
  Globe, 
  Github, 
  Facebook, 
  Instagram, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  Layers,
  ExternalLink,
  Plus,
  Check,
  Settings
} from 'lucide-react';

const integrations = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Sync your generated content directly to Google Drive',
    icon: '🔗',
    category: 'Storage',
    status: 'available',
    color: 'bg-blue-500'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Push code and documentation to your repositories',
    icon: Github,
    category: 'Development',
    status: 'available',
    color: 'bg-gray-800'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Schedule and publish posts to your Facebook pages',
    icon: Facebook,
    category: 'Social Media',
    status: 'connected',
    color: 'bg-blue-600'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Share generated images and content to Instagram',
    icon: Instagram,
    category: 'Social Media',
    status: 'available',
    color: 'bg-pink-500'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Send generated content via email campaigns',
    icon: Mail,
    category: 'Email',
    status: 'available',
    color: 'bg-red-500'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Share content and collaborate with your team',
    icon: MessageSquare,
    category: 'Communication',
    status: 'available',
    color: 'bg-green-500'
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Track performance of your published content',
    icon: BarChart3,
    category: 'Analytics',
    status: 'available',
    color: 'bg-orange-500'
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Schedule content publication dates',
    icon: Calendar,
    category: 'Productivity',
    status: 'available',
    color: 'bg-indigo-500'
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Export generated designs to Figma projects',
    icon: '🎨',
    category: 'Design',
    status: 'coming-soon',
    color: 'bg-purple-500'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync product descriptions to your store',
    icon: '🛒',
    category: 'E-commerce',
    status: 'coming-soon',
    color: 'bg-green-600'
  }
];

const categories = ['All', 'Social Media', 'Storage', 'Development', 'Email', 'Communication', 'Analytics', 'Productivity', 'Design', 'E-commerce'];

function IntegrationsPanel() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (integrationId) => {
    console.log(`Connecting to ${integrationId}...`);
    // Here you would typically open OAuth flow or configuration modal
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Available
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-indigo-50/30 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600">Connect with thousands of external tools</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const IconComponent = integration.icon;
          const isConnected = integration.status === 'connected';
          const isComingSoon = integration.status === 'coming-soon';
          
          return (
            <div
              key={integration.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${
                isConnected ? 'ring-2 ring-green-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {typeof integration.icon === 'string' ? (
                    <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                      {integration.icon}
                    </div>
                  ) : (
                    <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-xs text-gray-500">{integration.category}</p>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={isComingSoon}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isConnected
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : isComingSoon
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-md'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </>
                  ) : isComingSoon ? (
                    <span>Coming Soon</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
                
                {!isComingSoon && (
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom integration?</h2>
        <p className="text-purple-100 mb-6">
          We can help you connect Creeator to any tool your team uses.
        </p>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Request Integration
        </button>
      </div>
    </div>
  );
}

export default IntegrationsPanel;
