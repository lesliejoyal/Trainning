import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  'Engineering', 'Design', 'HR', 'Finance', 'Sales',
  'Marketing', 'Operations', 'Product', 'Legal', 'Support'
];

const ROLES = [
  'Junior Developer', 'Senior Developer', 'Team Lead', 'Manager',
  'Director', 'Designer', 'Analyst', 'Coordinator', 'Specialist', 'Intern'
];

export default function AddEmployee({ editEmployee, onAdd, onUpdate, onCancel }) {
  const navigate = useNavigate();
  const empty = { name: '', department: '', email: '', role: '', phone: '', location: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(editEmployee ? { ...empty, ...editEmployee } : empty);
    setErrors({});
  }, [editEmployee]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (editEmployee) {
        await onUpdate(form);
      } else {
        await onAdd(form);
      }
      navigate('/employees');
    } catch {
      // errors handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    navigate('/employees');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">
            {editEmployee ? '✏️ Edit Employee' : '＋ Add Employee'}
          </div>
          <div className="page-subtitle">
            {editEmployee
              ? `Editing record for ${editEmployee.name}`
              : 'Register a new team member in the system'}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          ← Back to Employees
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        {/* Main Form */}
        <div className={`card animate-fade-up animate-delay-1 ${editEmployee ? 'editing' : ''}`}
          style={editEmployee ? { borderColor: 'rgba(59,130,246,0.4)', boxShadow: '0 0 0 3px rgba(59,130,246,0.08)' } : {}}>

          {editEmployee && (
            <div style={{
              padding: '12px 24px',
              background: 'rgba(59,130,246,0.08)',
              borderBottom: '1px solid rgba(59,130,246,0.2)',
              color: 'var(--blue-lt)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              ✏️ Editing: <strong>{editEmployee.name}</strong>
              <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={handleCancel}>
                Cancel Edit
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="card-body">

              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      type="text"
                      name="name"
                      placeholder="e.g. Jane Smith"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div className="input-wrap">
                    <span className="input-icon">📧</span>
                    <input
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      type="email"
                      name="email"
                      placeholder="e.g. jane@company.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <div className="input-wrap">
                    <select
                      className={`form-select ${errors.department ? 'error' : ''}`}
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    >
                      <option value="">Select department…</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <span className="form-error">{errors.department}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <div className="input-wrap">
                    <select
                      className="form-select"
                      name="role"
                      value={form.role || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select role…</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrap">
                    <span className="input-icon">📱</span>
                    <input
                      className="form-input"
                      type="tel"
                      name="phone"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={form.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Office</label>
                  <div className="input-wrap">
                    <span className="input-icon">📍</span>
                    <input
                      className="form-input"
                      type="text"
                      name="location"
                      placeholder="e.g. New York, NY"
                      value={form.location || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={loading}
                  style={{ flex: 2 }}
                >
                  {loading
                    ? '⏳ Saving…'
                    : editEmployee
                    ? '💾 Save Changes'
                    : '🚀 Add Employee'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={handleCancel}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card animate-fade-up animate-delay-2">
            <div className="card-header">
              <div className="card-title">💡 Tips</div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['✅', 'Name & email are required fields'],
                ['🏢', 'Choose department from the dropdown'],
                ['📧', 'Use a valid corporate email format'],
                ['📍', 'Location helps with remote/onsite tracking'],
              ].map(([icon, tip]) => (
                <div key={tip} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{icon}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card animate-fade-up animate-delay-3">
            <div className="card-header">
              <div className="card-title">🏢 Departments</div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DEPARTMENTS.map(d => (
                <span
                  key={d}
                  className="chip purple"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setForm(prev => ({ ...prev, department: d }))}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
