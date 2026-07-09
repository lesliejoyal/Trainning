import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Briefcase, X, CalendarCheck, CalendarClock, DollarSign, BarChart2, UserCircle } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sections = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/app',           icon: LayoutDashboard },
      ],
    },
    {
      label: 'Workforce',
      items: [
        { name: 'Employees',  href: '/app/employees',  icon: Users        },
        { name: 'Attendance', href: '/app/attendance', icon: CalendarCheck },
        { name: 'Leaves',     href: '/app/leaves',     icon: CalendarClock },
      ],
    },
    {
      label: 'Finance',
      items: [
        { name: 'Payroll',  href: '/app/payroll',  icon: DollarSign },
        { name: 'Reports',  href: '/app/reports',  icon: BarChart2  },
      ],
    },
    {
      label: 'Account',
      items: [
        { name: 'Profile',  href: '/app/profile',  icon: UserCircle },
        { name: 'Settings', href: '/app/settings', icon: Settings   },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar component */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EMS Portal</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 gap-1">
          <nav className="flex-1 space-y-5">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/app'}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                          }`
                        }
                        onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                      >
                        <Icon className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0" />
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Need help?</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Check our documentation</p>
            <button className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
