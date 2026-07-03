import React, { useState } from 'react';
import Navbar from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <Navbar toggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
