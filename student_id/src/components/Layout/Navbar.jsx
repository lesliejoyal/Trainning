import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User, Bell, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const avatarColors = [
    'from-indigo-500 to-violet-600',
    'from-rose-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
  ];
  const avatarColor = avatarColors[initials.charCodeAt(0) % avatarColors.length];

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-800/60 sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left — logo + hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost p-2 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                EduTrack
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Student Management
              </p>
            </div>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2 rounded-xl relative"
            aria-label="Toggle theme"
          >
            <div className="relative w-5 h-5">
              <Sun  className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </button>

          {/* Notification Bell */}
          <button className="btn btn-ghost p-2 rounded-xl relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`avatar w-8 h-8 text-xs bg-gradient-to-br ${avatarColor}`}>
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-none">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize leading-none mt-0.5">
                  {user?.role}
                </p>
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
