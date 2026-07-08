import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '/':           { label: 'Dashboard',    icon: '⊞' },
  '/employees':  { label: 'Employees',    icon: '👥' },
  '/add':        { label: 'Add Employee', icon: '＋' },
  '/analytics':  { label: 'Analytics',   icon: '📊' },
  '/settings':   { label: 'Settings',    icon: '⚙️' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { label: 'Page', icon: '📄' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <span>{meta.icon}</span>
          <span>›</span>
          <span className="page-name">{meta.label}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-pill">System Online</div>
        <button className="icon-btn" title="Notifications">🔔</button>
        <button className="icon-btn" title="Help">❓</button>
      </div>
    </header>
  );
}
