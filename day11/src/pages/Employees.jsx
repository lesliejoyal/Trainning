import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials, getAvatarColor, getDeptClass } from '../utils';

/* ── Employee Profile Modal ── */
function ProfileModal({ employee, onClose, onEdit, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-md" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="profile-header">
          <div className={`emp-avatar xl ${getAvatarColor(employee.name)}`} style={{ margin: '0 auto' }}>
            {getInitials(employee.name)}
          </div>
          <div className="profile-name">{employee.name}</div>
          <div className="profile-email">{employee.email}</div>
          <br />
          <span className={`dept-badge ${getDeptClass(employee.department)}`}>
            {employee.department || 'Unassigned'}
          </span>
        </div>

        <div className="profile-fields">
          <div>
            <div className="profile-field-label">Employee ID</div>
            <div className="profile-field-value" style={{ fontFamily: 'monospace', color: 'var(--purple-lt)' }}>
              #{employee.id}
            </div>
          </div>
          <div>
            <div className="profile-field-label">Status</div>
            <div className="profile-field-value"><span className="status-dot">Active</span></div>
          </div>
          <div>
            <div className="profile-field-label">Department</div>
            <div className="profile-field-value">{employee.department || 'N/A'}</div>
          </div>
          <div>
            <div className="profile-field-label">Email</div>
            <div className="profile-field-value" style={{ wordBreak: 'break-all', fontSize: 13 }}>{employee.email}</div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-edit" style={{ flex: 1 }} onClick={() => { onEdit(employee); onClose(); }}>
            ✏️ Edit Employee
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { onDelete(employee.id); onClose(); }}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Employees({ employees, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const departments = useMemo(() =>
    [...new Set(employees.map(e => e.department).filter(Boolean))].sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = employees.filter(emp => {
      const matchSearch =
        emp.name?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.department?.toLowerCase().includes(q);
      const matchDept = filterDept ? emp.department === filterDept : true;
      return matchSearch && matchDept;
    });

    list = [...list].sort((a, b) => {
      let va = (a[sortKey] || '').toString().toLowerCase();
      let vb = (b[sortKey] || '').toString().toLowerCase();
      if (sortKey === 'id') { va = Number(a.id); vb = Number(b.id); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [employees, search, filterDept, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Employee Directory</div>
          <div className="page-subtitle">
            {filtered.length} of {employees.length} employees
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => navigate('/add')}>
            ＋ Add Employee
          </button>
        </div>
      </div>

      {/* Table / Grid Card */}
      <div className="card animate-fade-up animate-delay-1">
        {/* Filter Bar */}
        <div className="card-header">
          <div className="filter-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search name, email, dept…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select-sm"
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {(search || filterDept) && (
              <button className="btn btn-secondary btn-sm"
                onClick={() => { setSearch(''); setFilterDept(''); }}>
                ✕ Clear
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >≡</button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >⊞</button>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{employees.length === 0 ? '🧑‍💼' : '🔍'}</div>
            <div className="empty-title">
              {employees.length === 0 ? 'No employees yet' : 'No results found'}
            </div>
            <div className="empty-subtitle">
              {employees.length === 0
                ? 'Add your first employee to get started'
                : 'Try adjusting your search or filter'}
            </div>
            {employees.length === 0 && (
              <>
                <br />
                <button className="btn btn-primary" onClick={() => navigate('/add')}>
                  ＋ Add Employee
                </button>
              </>
            )}
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className={sortKey === 'id' ? 'sorted' : ''} onClick={() => toggleSort('id')}>
                    #{sortIcon('id')}
                  </th>
                  <th className={sortKey === 'name' ? 'sorted' : ''} onClick={() => toggleSort('name')}>
                    Employee{sortIcon('name')}
                  </th>
                  <th className={sortKey === 'department' ? 'sorted' : ''} onClick={() => toggleSort('department')}>
                    Department{sortIcon('department')}
                  </th>
                  <th className={sortKey === 'email' ? 'sorted' : ''} onClick={() => toggleSort('email')}>
                    Email{sortIcon('email')}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 11,
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '3px 8px', borderRadius: 5,
                        border: '1px solid var(--border)'
                      }}>#{emp.id}</span>
                    </td>
                    <td>
                      <div className="emp-name-cell">
                        <div
                          className={`emp-avatar ${getAvatarColor(emp.name)}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedEmployee(emp)}
                          title="View profile"
                        >
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <div
                            className="emp-name"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedEmployee(emp)}
                          >
                            {emp.name}
                          </div>
                          <div className="emp-id">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`dept-badge ${getDeptClass(emp.department)}`}>
                        {emp.department || 'Unassigned'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{emp.email}</td>
                    <td><span className="status-dot">Active</span></td>
                    <td>
                      <div className="action-cell">
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedEmployee(emp)} title="View profile">
                          👁️
                        </button>
                        <button className="btn btn-edit btn-sm"
                          onClick={() => { onEdit(emp); navigate('/add'); }}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => onDelete(emp.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="emp-grid">
            {filtered.map((emp) => (
              <div
                key={emp.id}
                className="emp-card"
                onClick={() => setSelectedEmployee(emp)}
              >
                <div className={`emp-avatar lg ${getAvatarColor(emp.name)}`}
                  style={{ margin: '0 auto 14px' }}>
                  {getInitials(emp.name)}
                </div>
                <div className="emp-card-name">{emp.name}</div>
                <div className="emp-card-email">{emp.email}</div>
                <div className="emp-card-dept">
                  <span className={`dept-badge ${getDeptClass(emp.department)}`}>
                    {emp.department || 'Unassigned'}
                  </span>
                </div>
                <div className="emp-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-edit btn-sm"
                    onClick={() => { onEdit(emp); navigate('/add'); }}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => onDelete(emp.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedEmployee && (
        <ProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={(emp) => { onEdit(emp); navigate('/add'); }}
          onDelete={(id) => { onDelete(id); setSelectedEmployee(null); }}
        />
      )}
    </div>
  );
}
