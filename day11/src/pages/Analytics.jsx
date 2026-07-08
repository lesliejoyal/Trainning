import { useMemo } from 'react';
import { getDeptClass } from '../utils';

/* ── Animated circular progress (SVG) ── */
function CircularProgress({ value, max, color, size = 120, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const r = (size / 2) - 14;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s var(--spring)' }}
        />
      </svg>
      <div style={{ marginTop: -size/2 - 10, height: size/2 + 10 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function Analytics({ employees }) {
  const departments = useMemo(() =>
    [...new Set(employees.map(e => e.department).filter(Boolean))],
    [employees]
  );

  const deptData = useMemo(() => {
    const counts = {};
    employees.forEach(e => {
      if (e.department) counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([dept, count]) => ({ dept, count, pct: employees.length > 0 ? Math.round((count / employees.length) * 100) : 0 }));
  }, [employees]);

  const maxCount = deptData[0]?.count || 1;

  const gradMap = {
    eng:     'linear-gradient(90deg,#7c3aed,#3b82f6)',
    design:  'linear-gradient(90deg,#ec4899,#8b5cf6)',
    hr:      'linear-gradient(90deg,#10b981,#06b6d4)',
    finance: 'linear-gradient(90deg,#f59e0b,#ef4444)',
    sales:   'linear-gradient(90deg,#3b82f6,#06b6d4)',
    ops:     'linear-gradient(90deg,#06b6d4,#10b981)',
    default: 'linear-gradient(90deg,#475569,#94a3b8)',
  };

  const colorMap = {
    eng: '#a78bfa', design: '#f472b6', hr: '#34d399',
    finance: '#fbbf24', sales: '#60a5fa', ops: '#22d3ee', default: '#94a3b8',
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Analytics Overview</div>
          <div className="page-subtitle">Workforce insights and department breakdown</div>
        </div>
        <div className="chip purple">{employees.length} Total Records</div>
      </div>

      {/* Summary Row */}
      <div className="stats-grid animate-fade-up animate-delay-1">
        {[
          { icon: '👥', cls: 'purple', val: employees.length,    label: 'Total Employees' },
          { icon: '🏢', cls: 'blue',   val: departments.length,   label: 'Departments' },
          { icon: '✅', cls: 'green',  val: employees.length,    label: 'Active Staff' },
          { icon: '📊', cls: 'orange', val: `${deptData[0]?.pct || 0}%`, label: 'Top Dept Share' },
        ].map(({ icon, cls, val, label }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${cls}`}>{icon}</div>
            <div className="stat-body">
              <div className="stat-number">{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Department Bar Chart */}
        <div className="card animate-fade-up animate-delay-2">
          <div className="card-header">
            <div>
              <div className="card-title">Department Distribution</div>
              <div className="card-subtitle">Employees per department</div>
            </div>
          </div>
          <div className="card-body">
            {deptData.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-icon">📊</div>
                <div className="empty-subtitle">No department data</div>
              </div>
            ) : (
              deptData.map(({ dept, count, pct }) => {
                const cls = getDeptClass(dept);
                return (
                  <div key={dept} className="chart-bar-row" style={{ marginBottom: 18 }}>
                    <div className="chart-bar-label">{dept}</div>
                    <div style={{ flex: 1 }}>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: `${(count / maxCount) * 100}%`,
                            background: gradMap[cls] || gradMap.default,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                        {pct}% of workforce
                      </div>
                    </div>
                    <div className="chart-bar-value" style={{ color: colorMap[cls] || colorMap.default }}>
                      {count}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Circular Metrics */}
        <div className="card animate-fade-up animate-delay-2">
          <div className="card-header">
            <div>
              <div className="card-title">Team Metrics</div>
              <div className="card-subtitle">Visual workforce indicators</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0 24px' }}>
              <CircularProgress value={employees.length} max={Math.max(employees.length, 50)} color="#7c3aed" label="Headcount" />
              <CircularProgress value={departments.length} max={Math.max(departments.length, 10)} color="#10b981" label="Teams" />
              <CircularProgress value={100} max={100} color="#3b82f6" label="Active %" />
            </div>

            <div className="divider" />

            <div className="section-label">Workforce Capacity</div>
            {[
              { label: 'Headcount vs target (50)', val: employees.length, max: 50, color: '#7c3aed' },
              { label: 'Department coverage',       val: departments.length, max: 10, color: '#10b981' },
              { label: 'Active rate',               val: 100, max: 100, color: '#3b82f6' },
            ].map(({ label, val, max, color }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>{Math.min(Math.round((val / max) * 100), 100)}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min((val / max) * 100, 100)}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="card animate-fade-up animate-delay-3">
        <div className="card-header">
          <div>
            <div className="card-title">Department Summary</div>
            <div className="card-subtitle">Detailed breakdown by team</div>
          </div>
        </div>
        {deptData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-subtitle">No data available yet. Add employees to see insights.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Share</th>
                  <th>Distribution</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map(({ dept, count, pct }) => {
                  const cls = getDeptClass(dept);
                  return (
                    <tr key={dept}>
                      <td>
                        <span className={`dept-badge ${cls}`}>{dept}</span>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 15 }}>{count}</td>
                      <td style={{ color: colorMap[cls] || colorMap.default, fontWeight: 600 }}>{pct}%</td>
                      <td style={{ width: 180 }}>
                        <div className="progress-bar-wrap">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: gradMap[cls] || gradMap.default,
                            }}
                          />
                        </div>
                      </td>
                      <td><span className="status-dot">Active</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
