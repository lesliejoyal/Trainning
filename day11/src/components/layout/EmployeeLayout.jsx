import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UserCircle, CalendarCheck, CalendarClock,
  DollarSign, CheckSquare, Bell, CalendarDays, Settings,
  Briefcase, X, Menu, Moon, Sun, LogOut, ChevronRight, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../hooks/useSettings';
import { useNotifications } from '../../hooks/useNotifications';
import CommandPalette from '../ui/CommandPalette';

const NAV_ITEMS = [
  { label: 'My Workspace', items: [
    { name: 'Dashboard',      href: '/portal',              icon: LayoutDashboard, end: true },
    { name: 'My Profile',     href: '/portal/profile',      icon: UserCircle },
  ]},
  { label: 'Time & Leave', items: [
    { name: 'Attendance',     href: '/portal/attendance',   icon: CalendarCheck },
    { name: 'My Leaves',      href: '/portal/leaves',       icon: CalendarClock },
  ]},
  { label: 'Finance', items: [
    { name: 'Payroll',        href: '/portal/payroll',      icon: DollarSign },
  ]},
  { label: 'Work', items: [
    { name: 'My Tasks',       href: '/portal/tasks',        icon: CheckSquare },
    { name: 'Notifications',  href: '/portal/notifications',icon: Bell },
    { name: 'Calendar',       href: '/portal/calendar',     icon: CalendarDays },
  ]},
  { label: 'Account', items: [
    { name: 'Settings',       href: '/portal/settings',     icon: Settings },
  ]},
];

const Sidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'E';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 lg:flex"
        style={{ transform: undefined }}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">தமிழா தமிழி</span>
              <p className="text-[10px] text-indigo-500 font-medium -mt-0.5">Employee Self-Service</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_ITEMS.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.end}
                      onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User + Logout */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name ?? 'Employee'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.employeeId ?? ''}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const Topbar = ({ onMenuClick }) => {
  const { settings, updateSetting } = useSettings();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 lg:flex-none flex items-center gap-4">
        <span className="hidden lg:block text-sm font-medium text-slate-500 dark:text-slate-400">
          Welcome back, <span className="text-slate-900 dark:text-white font-semibold">{user?.name?.split(' ')[0]}</span> 👋
        </span>

        {/* Global Search trigger bar */}
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 text-xs text-slate-400 transition-colors w-52 text-left"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Search or press Ctrl K</span>
        </button>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <button
          onClick={() => navigate('/portal/notifications')}
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white">
            {user?.name?.charAt(0) ?? 'E'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
            {user?.name ?? 'Employee'}
          </span>
        </div>
      </div>
    </header>
  );
};

const EmployeeLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      <div className="hidden lg:flex">
        <Sidebar isOpen={true} onClose={() => {}} user={user} />
      </div>
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />}
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
