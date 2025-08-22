
import React from 'react';

export default function AppShell({ sidebar, children }) {
  return (
    <div className="app-shell bg-gray-50 flex">
      <aside className="sidebar shrink-0 sticky top-0 h-dvh overflow-y-auto">
        {sidebar}
      </aside>
      <main className="content flex-1 overflow-x-hidden px-6 py-6">
        {children}
      </main>
    </div>
  );
}
