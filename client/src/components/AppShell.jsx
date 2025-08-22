
import React from 'react';

export default function AppShell({ sidebar, children }) {
  return (
    <div className="app-shell bg-[var(--bg)] flex">
      <aside className="sidebar shrink-0 sticky top-0 h-dvh overflow-y-auto bg-white/80 backdrop-blur border-r border-[var(--border)]">
        {sidebar}
      </aside>
      <main className="content flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
