import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Shield, User, Settings, Sparkles, Moon, Sun, X, Clock, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../hooks/useEmployees';
import { useSettings } from '../../hooks/useSettings';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();
  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    // Navigation routes based on role
    ...(isAdmin ? [
      { label: 'Go to Dashboard', href: '/app', icon: Compass, category: 'Navigation' },
      { label: 'Manage Employees', href: '/app/employees', icon: User, category: 'Navigation' },
      { label: 'View Attendance', href: '/app/attendance', icon: Shield, category: 'Navigation' },
      { label: 'Leave Approvals', href: '/app/leaves', icon: Clock, category: 'Navigation' },
      { label: 'Run Payroll', href: '/app/payroll', icon: Shield, category: 'Navigation' },
      { label: 'Analytics Reports', href: '/app/reports', icon: Sparkles, category: 'Navigation' },
      { label: 'Company Settings', href: '/app/settings', icon: Settings, category: 'Navigation' }
    ] : [
      { label: 'Go to Portal Home', href: '/portal', icon: Compass, category: 'Navigation' },
      { label: 'My Profile Card', href: '/portal/profile', icon: User, category: 'Navigation' },
      { label: 'Mark My Attendance', href: '/portal/attendance', icon: Shield, category: 'Navigation' },
      { label: 'Apply for Leaves', href: '/portal/leaves', icon: Clock, category: 'Navigation' },
      { label: 'My Payslips & Payroll', href: '/portal/payroll', icon: Shield, category: 'Navigation' },
      { label: 'My Tasks & Work Log', href: '/portal/tasks', icon: Sparkles, category: 'Navigation' },
      { label: 'Settings', href: '/portal/settings', icon: Settings, category: 'Navigation' }
    ]),
    // Common Actions
    { label: 'Switch to Dark Theme', action: () => updateSetting('theme', 'dark'), icon: Moon, category: 'System Preferences' },
    { label: 'Switch to Light Theme', action: () => updateSetting('theme', 'light'), icon: Sun, category: 'System Preferences' },
    { label: 'Compact Layout Density', action: () => updateSetting('density', 'compact'), icon: Settings, category: 'System Preferences' },
    { label: 'Comfortable Layout Density', action: () => updateSetting('density', 'comfortable'), icon: Settings, category: 'System Preferences' },
  ];

  // Filter menu items and employee records
  const filteredMenu = menuItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedEmployees = query.length > 1 ? employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    emp.department.toLowerCase().includes(query.toLowerCase()) ||
    emp.role.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const handleSelect = (item) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  const handleEmpSelect = (empId) => {
    if (isAdmin) {
      navigate(`/app/employees?id=${empId}`);
    } else {
      navigate(`/portal/profile`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search bar input */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search employees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose} 
            className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic results scroll pane */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-2">
          {/* Employee search results */}
          {matchedEmployees.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Employees Matching</p>
              <div className="mt-1 space-y-1">
                {matchedEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => handleEmpSelect(emp.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white group transition-colors"
                  >
                    <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center font-bold">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[10px] text-slate-400 group-hover:text-indigo-100">{emp.role} · {emp.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Commands list */}
          {filteredMenu.length > 0 ? (
            <div>
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Commands & Actions</p>
              <div className="mt-1 space-y-1">
                {filteredMenu.map((item, index) => {
                  const IconComp = item.icon || HelpCircle;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white group transition-colors"
                    >
                      <IconComp className="h-4.5 w-4.5 text-slate-400 group-hover:text-white" />
                      <span className="font-medium flex-1">{item.label}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-indigo-100">{item.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            matchedEmployees.length === 0 && (
              <div className="py-8 text-center text-slate-400">
                <Compass className="h-8 w-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs">No matching commands or employees found.</p>
              </div>
            )
          )}
        </div>

        {/* Footer info/tips */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 px-4 py-2 text-[10px] text-slate-400">
          <span>Tip: Use keys ↑ ↓ to navigate and ↵ to select</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
