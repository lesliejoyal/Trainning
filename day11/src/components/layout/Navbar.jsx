import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Bell, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';
import CommandPalette from '../ui/CommandPalette';

const Navbar = ({ toggleSidebar }) => {
  const { settings, updateSetting } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const isDarkMode = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleDarkMode = () => {
    updateSetting('theme', isDarkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="hidden lg:block lg:text-lg lg:font-extrabold lg:text-slate-800 lg:dark:text-white">
          Admin Portal
        </div>

        {/* Global Search trigger bar */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-colors w-64 text-left"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Search anything...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-1.5 font-mono text-[9px] font-medium text-slate-400">Ctrl K</kbd>
        </button>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      <div className="flex items-center gap-3">
        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className="sr-only">Notifications</span>
          <Bell className="h-5 w-5" />
        </button>

        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span className="sr-only">Toggle dark mode</span>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
            {user?.name ?? 'Admin'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="rounded-full p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
        >
          <span className="sr-only">Logout</span>
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
