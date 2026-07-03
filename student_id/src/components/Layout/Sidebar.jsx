import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard, roles: ['admin', 'teacher'] },
  { label: 'Students',   href: '/students',   icon: Users,            roles: ['admin', 'teacher'] },
  { label: 'Attendance', href: '/attendance', icon: CalendarCheck,    roles: ['admin', 'teacher'] },
  { label: 'Reports',    href: '/reports',    icon: BarChart3,        roles: ['admin', 'teacher'] },
];

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const filtered = navItems.filter((i) => i.roles.includes(user?.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
          border-r border-slate-200/60 dark:border-gray-800/60
          transform transition-transform duration-300 z-40
          lg:static lg:translate-x-0 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-1">
          {/* Section Label */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-3">
            Navigation
          </p>

          {filtered.map(({ label, href, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                onClick={closeSidebar}
                className={`nav-item ${active ? 'nav-item-active' : ''}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">EduTrack v2.0</p>
              <p className="text-[10px] text-slate-400">Frontend Edition</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
