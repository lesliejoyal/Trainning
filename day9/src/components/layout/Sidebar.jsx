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
  BookOpen,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Students',   href: '/students',   icon: Users },
  { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { label: 'Academic',   href: '/academic',   icon: BookOpen },
  { label: 'Reports',    href: '/reports',    icon: BarChart3 },
];

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const filtered = navItems;

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
          bg-[#1a1a2e] dark:bg-[#0b0f1a]
          transform transition-transform duration-300 z-40
          lg:static lg:translate-x-0 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* User profile area */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.split(' ')[0]?.[0] || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
              <p className="text-[11px] text-white/40 capitalize">{user?.role || 'Student'}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-3">
            Menu
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-xl bg-[#4f6ef7] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">StudentBuddy</p>
              <p className="text-[10px] text-white/30">Management System</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
