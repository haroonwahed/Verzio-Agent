import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Verzio Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user?.email}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded-md">Logout</button>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <Tabs.Root defaultValue="text" className="w-full">
        <Tabs.List className="flex space-x-2 mb-4 overflow-x-auto">
            <Tabs.Trigger value="text" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Text</Tabs.Trigger>
            <Tabs.Trigger value="image" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Image</Tabs.Trigger>
            <Tabs.Trigger value="voice" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Voice</Tabs.Trigger>
            <Tabs.Trigger value="seo" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">SEO</Tabs.Trigger>
            <Tabs.Trigger value="workflow" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Workflow</Tabs.Trigger>
          <Tabs.Trigger value="feeds" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Feeds</Tabs.Trigger>
          <Tabs.Trigger value="wolleys" className="px-4 py-2 rounded bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none">Wolleys</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="text" className="bg-white rounded-md shadow">
            <TextPanel />
          </Tabs.Content>
          <Tabs.Content value="image" className="bg-white rounded-md shadow">
            <ImagePanel />
          </Tabs.Content>
          <Tabs.Content value="voice" className="bg-white rounded-md shadow">
            <VoicePanel />
          </Tabs.Content>
          <Tabs.Content value="seo" className="bg-white rounded-md shadow">
            <SeoPanel />
          </Tabs.Content>
          <Tabs.Content value="workflow" className="bg-white rounded-md shadow">
            <WorkflowBuilder />
          </Tabs.Content>
          <Tabs.Content value="feeds" className="bg-white rounded-md shadow">
            <FeedsPanel />
          </Tabs.Content>
        <Tabs.Content value="wolleys" className="bg-white rounded-md shadow">
          {/* Panel for managing Wolleys */}
          <WolleysPanel />
        </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  );
}

export default Dashboard;