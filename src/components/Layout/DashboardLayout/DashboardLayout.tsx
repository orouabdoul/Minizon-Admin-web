import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';

interface DashboardLayoutProps {
  title:    string;
  children: ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const open  = useCallback(() => setSidebarOpen(true),  []);
  const close = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="dash-layout">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="dash-backdrop" onClick={close} aria-hidden="true" />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={close} />

      <div className="dash-main">
        <Header title={title} onMenuToggle={open} />
        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  );
}
