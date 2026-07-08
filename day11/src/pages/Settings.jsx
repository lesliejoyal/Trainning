import { useState } from 'react';

const TABS = ['Profile', 'Notifications', 'Appearance', 'System'];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@empmanager.com',
    role: 'Super Admin',
    company: 'EmpManager Corp',
    timezone: 'UTC+5:30',
  });
  const [notifs, setNotifs] = useState({
    newEmployee: true,
    deletions: true,
    weeklyReport: false,
    emailAlerts: true,
  });
  const [appearance, setAppearance] = useState({
    compactMode: false,
    animations: true,
    sidebarIcons: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your account and application preferences</div>
        </div>
        {saved && (
          <div className="chip green" style={{ padding: '8px 16px', fontSize: 13 }}>
            ✅ Changes saved
          </div>
        )}
      </div>

      <div className="settings-grid animate-fade-up animate-delay-1">
        {/* Settings Nav */}
        <div className="card" style={{ padding: '12px' }}>
          <div className="settings-nav">
            {TABS.map(tab => (
              <div
                key={tab}
                className={`settings-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span>
                  {tab === 'Profile' ? '👤' :
                   tab === 'Notifications' ? '🔔' :
                   tab === 'Appearance' ? '🎨' : '⚙️'}
                </span>
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="card">
          {/* Profile */}
          {activeTab === 'Profile' && (
            <div>
              <div className="card-header">
                <div>
                  <div className="card-title">👤 Profile Settings</div>
                  <div className="card-subtitle">Manage your account information</div>
                </div>
              </div>
              <div className="card-body">
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
                  <div className="emp-avatar xl" style={{ background: 'var(--grad-main)' }}>AD</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{profile.role}</div>
                    <div style={{ marginTop: 10 }}>
                      <button className="btn btn-secondary btn-sm">Change Avatar</button>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-wrap">
                      <span className="input-icon">👤</span>
                      <input className="form-input" type="text" value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="input-wrap">
                      <span className="input-icon">📧</span>
                      <input className="form-input" type="email" value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <div className="input-wrap">
                      <span className="input-icon">🏢</span>
                      <input className="form-input" type="text" value={profile.company}
                        onChange={e => setProfile({ ...profile, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <div className="input-wrap">
                      <span className="input-icon">🌍</span>
                      <input className="form-input" type="text" value={profile.timezone}
                        onChange={e => setProfile({ ...profile, timezone: e.target.value })} />
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={handleSave}>
                  💾 Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <div>
              <div className="card-header">
                <div>
                  <div className="card-title">🔔 Notification Settings</div>
                  <div className="card-subtitle">Control what alerts you receive</div>
                </div>
              </div>
              <div className="card-body">
                {[
                  { key: 'newEmployee', label: 'New Employee Added', desc: 'Get notified when a new employee joins' },
                  { key: 'deletions',  label: 'Employee Removed',    desc: 'Alert when an employee record is deleted' },
                  { key: 'weeklyReport', label: 'Weekly Report',     desc: 'Receive a weekly workforce summary email' },
                  { key: 'emailAlerts',  label: 'Email Alerts',      desc: 'Receive important alerts via email' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="toggle-row">
                    <div>
                      <div className="toggle-label">{label}</div>
                      <div className="toggle-desc">{desc}</div>
                    </div>
                    <Toggle
                      checked={notifs[key]}
                      onChange={() => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))}
                    />
                  </div>
                ))}
                <div style={{ marginTop: 24 }}>
                  <button className="btn btn-primary" onClick={handleSave}>Save Preferences</button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'Appearance' && (
            <div>
              <div className="card-header">
                <div>
                  <div className="card-title">🎨 Appearance</div>
                  <div className="card-subtitle">Customize the interface look</div>
                </div>
              </div>
              <div className="card-body">
                {[
                  { key: 'animations', label: 'Enable Animations', desc: 'Smooth transitions and micro-interactions' },
                  { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce padding for a denser layout' },
                  { key: 'sidebarIcons', label: 'Sidebar Icons', desc: 'Show icons in the navigation sidebar' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="toggle-row">
                    <div>
                      <div className="toggle-label">{label}</div>
                      <div className="toggle-desc">{desc}</div>
                    </div>
                    <Toggle
                      checked={appearance[key]}
                      onChange={() => setAppearance(prev => ({ ...prev, [key]: !prev[key] }))}
                    />
                  </div>
                ))}

                <div className="divider" />

                <div className="section-label">Color Accent</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    ['#7c3aed', '#3b82f6'],
                    ['#10b981', '#06b6d4'],
                    ['#f59e0b', '#ec4899'],
                    ['#ef4444', '#f59e0b'],
                    ['#ec4899', '#8b5cf6'],
                  ].map(([a, b]) => (
                    <div
                      key={a}
                      style={{
                        width: 36, height: 36,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${a}, ${b})`,
                        cursor: 'pointer',
                        border: '2px solid rgba(255,255,255,0.15)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>

                <div style={{ marginTop: 24 }}>
                  <button className="btn btn-primary" onClick={handleSave}>Save Appearance</button>
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === 'System' && (
            <div>
              <div className="card-header">
                <div>
                  <div className="card-title">⚙️ System Information</div>
                  <div className="card-subtitle">Application details and API configuration</div>
                </div>
              </div>
              <div className="card-body">
                {[
                  ['App Version',     'EmpManager Pro v2.0'],
                  ['Build',          'React 19 + Vite 8'],
                  ['API Status',     '🟢 Connected'],
                  ['Data Source',    'MockAPI (Live)'],
                  ['Last Sync',      new Date().toLocaleTimeString()],
                ].map(([label, val]) => (
                  <div key={label} className="toggle-row">
                    <div className="toggle-label">{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{val}</div>
                  </div>
                ))}

                <div className="divider" />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary">🔄 Clear Cache</button>
                  <button className="btn btn-secondary">📤 Export Data</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
