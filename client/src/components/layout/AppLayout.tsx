import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
