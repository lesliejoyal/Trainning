import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials, getAvatarColor, getDeptClass, timeAgo } from '../utils';

/* ── Stat Card ── */
function StatCard({ icon, iconClass, number, label, trend, trendDir, delay }) {
  return (
    <div className={`stat-card animate-fade-up animate-delay-${delay}`}>
      <div className={`stat-glow`} style={{
        background: iconClass === 'purple' ? 'var(--purple)' :
                    iconClass === 'blue'   ? 'var(--blue)' :
                    iconClass === 'green'  ? 'var(--green)' : 'var(--orange)'
      }} />
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-body">
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
        {trend && (
          <div className={`stat-trend ${trendDir}`}>
            <span>{trendDir === 'up' ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ employees, onEdit, onDelete }) {
  const navigate = useNavigate();

  const departments = useMemo(() =>
    [...new Set(employees.map(e => e.department).filter(Boolean))],
    [employees]
  );

  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach(e => {
      if (e.department) counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  const recent = useMemo(() =>
    [...employees].reverse().slice(0, 5),
    [employees]
  );

  const maxDeptCount = deptCounts[0]?.[1] || 1;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Welcome back, Admin 👋</div>
          <div className="page-subtitle">
            Here's an overview of your team as of{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
            📊 Analytics
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/add')}>
            ＋ Add Employee
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon="👥" iconClass="purple"
          number={employees.length}
          label="Total Employees"
          trend="All time" trendDir="up"
          delay={1}
        />
        <StatCard
          icon="🏢" iconClass="blue"
          number={departments.length}
          label="Departments"
          trend="Active units" trendDir="up"
          delay={2}
        />
        <StatCard
          icon="✅" iconClass="green"
          number={employees.length}
          label="Active Staff"
          trend="100% active" trendDir="up"
          delay={3}
        />
        <StatCard
          icon="📅" iconClass="orange"
          number={new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          label="Current Period"
          delay={4}
        />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

        {/* Recent Employees */}
        <div className="card animate-fade-up animate-delay-2">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Employees</div>
              <div className="card-subtitle">Latest additions to your team</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/employees')}>
              View All →
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧑‍💼</div>
              <div className="empty-title">No employees yet</div>
              <div className="empty-subtitle">Add your first employee to get started</div>
              <br />
              <button className="btn btn-primary" onClick={() => navigate('/add')}>
                ＋ Add Employee
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-name-cell">
                          <div className={`emp-avatar ${getAvatarColor(emp.name)}`}>
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <div className="emp-name">{emp.name}</div>
                            <div className="emp-id">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`dept-badge ${getDeptClass(emp.department)}`}>
                          {emp.department || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <span className="status-dot">Active</span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="btn btn-edit btn-sm" onClick={() => { onEdit(emp); navigate('/add'); }}>
                            ✏️
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => onDelete(emp.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Department Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card animate-fade-up animate-delay-3">
            <div className="card-header">
              <div>
                <div className="card-title">Departments</div>
                <div className="card-subtitle">{deptCounts.length} active units</div>
              </div>
            </div>
            <div className="card-body">
              {deptCounts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>
                  No department data yet
                </div>
              ) : (
                deptCounts.map(([dept, count]) => {
                  const pct = Math.round((count / employees.length) * 100);
                  const gradMap = {
                    eng: 'linear-gradient(90deg,#7c3aed,#3b82f6)',
                    design: 'linear-gradient(90deg,#ec4899,#8b5cf6)',
                    hr: 'linear-gradient(90deg,#10b981,#06b6d4)',
                    finance: 'linear-gradient(90deg,#f59e0b,#ef4444)',
                    sales: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
                    ops: 'linear-gradient(90deg,#06b6d4,#10b981)',
                    default: 'linear-gradient(90deg,#475569,#94a3b8)',
                  };
                  const cls = getDeptClass(dept);
                  return (
                    <div key={dept} className="chart-bar-row">
                      <div className="chart-bar-label">{dept}</div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${(count / maxDeptCount) * 100}%`,
                            background: gradMap[cls] || gradMap.default,
                          }}
                        />
                      </div>
                      <div className="chart-bar-value">{count}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card animate-fade-up animate-delay-4">
            <div className="card-header">
              <div className="card-title">Quick Actions</div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary btn-full" onClick={() => navigate('/add')}>
                ＋ Add New Employee
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => navigate('/employees')}>
                👥 View All Employees
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => navigate('/analytics')}>
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
