import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User, Bell, Search, GraduationCap } from 'lucide-react';
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

  return (
    <header className="h-16 bg-white dark:bg-[#1e293b] border-b border-[#e2e8f0] dark:border-slate-700 sticky top-0 z-50">
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
            <div className="w-9 h-9 rounded-xl bg-[#1a1a2e] dark:bg-[#4f6ef7] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[16px] font-bold text-[#1a1a2e] dark:text-white leading-none">
                Student<span className="text-[#4f6ef7]">buddy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center — search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search students, subjects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f1f5f9] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-slate-600 text-sm text-[#334155] dark:text-white placeholder-[#94a3b8] focus:ring-2 focus:ring-[#4f6ef7]/30 focus:border-[#4f6ef7] outline-none transition-all"
            />
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2.5 rounded-xl relative"
            aria-label="Toggle theme"
          >
            <div className="relative w-5 h-5">
              <Sun  className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </button>

          {/* Notification Bell */}
          <button className="btn btn-ghost p-2.5 rounded-xl relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-[#1e293b]" />
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#f1f5f9] dark:hover:bg-slate-700 transition-colors"
            >
              <div className="avatar w-8 h-8 text-xs bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa]">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1e293b] dark:text-white leading-none">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-[#94a3b8] capitalize leading-none mt-0.5">
                  {user?.role}
                </p>
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#e2e8f0] dark:border-slate-700">
                    <p className="text-sm font-semibold text-[#1e293b] dark:text-white">{user?.name}</p>
                    <p className="text-xs text-[#94a3b8] capitalize">{user?.role}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#475569] dark:text-slate-300 hover:bg-[#f1f5f9] dark:hover:bg-slate-700 transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
