import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',            icon: '⊞',  label: 'Dashboard' },
  { to: '/employees',   icon: '👥', label: 'Employees' },
  { to: '/add',         icon: '＋',  label: 'Add Employee' },
  { to: '/analytics',   icon: '📊', label: 'Analytics' },
  { to: '/settings',    icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ employeeCount }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">👥</div>
        <div>
          <div className="logo-text-main">EmpManager</div>
          <div className="logo-text-sub">HR Pro Suite</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>

        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
            {label === 'Employees' && employeeCount > 0 && (
              <span className="nav-badge">{employeeCount}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-label">System</div>
        <div className="nav-link" style={{ cursor: 'default' }}>
          <span className="nav-icon">🌐</span>
          <span>API Status</span>
          <span className="chip green" style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 8px' }}>Live</span>
        </div>
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar-sm">AD</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-role">Super Admin</div>
          </div>
          <div className="user-caret">⋯</div>
        </div>
      </div>
    </aside>
  );
}
