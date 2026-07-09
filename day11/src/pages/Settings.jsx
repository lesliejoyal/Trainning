import { useState } from 'react';
import {
  Save, Bell, Shield, Palette, Globe, Database,
  CheckCircle2, ToggleLeft, ToggleRight, Sun, Moon, Monitor,
  Mail, Smartphone, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSettings';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';

const ACCENTS = [
  { id: 'indigo',  label: 'Indigo',  cls: 'bg-indigo-600',  ring: 'ring-indigo-600'  },
  { id: 'violet',  label: 'Violet',  cls: 'bg-violet-600',  ring: 'ring-violet-600'  },
  { id: 'emerald', label: 'Emerald', cls: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { id: 'rose',    label: 'Rose',    cls: 'bg-rose-500',    ring: 'ring-rose-500'    },
  { id: 'amber',   label: 'Amber',   cls: 'bg-amber-500',   ring: 'ring-amber-500'   },
  { id: 'sky',     label: 'Sky',     cls: 'bg-sky-500',     ring: 'ring-sky-500'     },
];

const Section = ({ icon: Icon, title, description, color, children }) => (
  <Card>
    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <CardTitle className="text-sm">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </div>
    </div>
    <CardContent className="p-6">{children}</CardContent>
  </Card>
);

const Toggle = ({ label, description, value, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button onClick={() => onChange(!value)}
      className={`shrink-0 transition-all ${value ? 'text-indigo-600 dark:text-indigo-400 scale-100' : 'text-slate-300 dark:text-slate-600'}`}>
      {value ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
    </button>
  </div>
);

const Settings = () => {
  const { settings, updateSetting } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const set  = (k) => (v)  => updateSetting(k, v);
  const setV = (k) => (e)  => updateSetting(k, e.target.value);
  const tog  = (k) => (v)  => updateSetting(k, v);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Settings" 
        description="Manage application preferences, notifications, and security"
      >
        <Button onClick={handleSave} isLoading={isSaving}>
          <Save className="mr-2 h-4 w-4" /> Save All
        </Button>
      </PageHeader>

      {/* ── APPEARANCE ── */}
      <Section icon={Palette} title="Appearance & Theme" description="Customize the look and feel of the application" color="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Color Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id:'light',  icon: Sun,     label:'Light',  desc:'Always light mode'  },
              { id:'dark',   icon: Moon,    label:'Dark',   desc:'Always dark mode'   },
              { id:'system', icon: Monitor, label:'System', desc:'Follow OS setting'  },
            ].map(({ id, icon: Icon, label, desc }) => (
              <button key={id} onClick={() => set('theme')(id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-[1.02] ${
                  settings.theme === id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${settings.theme === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${settings.theme === id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                </div>
                {settings.theme === id && <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Accent Color</label>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button key={a.id} onClick={() => set('accent')(a.id)} title={a.label}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl ${a.cls} transition-all hover:scale-110 shadow-sm ${settings.accent === a.id ? `ring-2 ring-offset-2 ${a.ring} dark:ring-offset-slate-900 scale-110` : ''}`}>
                {settings.accent === a.id && <CheckCircle2 className="h-5 w-5 text-white" />}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">Note: Accent color change is visual only in this demo.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Language</label>
            <Select value={settings.language} onChange={setV('language')}>
              {[['en','English (US)'],['es','Español'],['fr','Français'],['de','Deutsch'],['hi','हिन्दी'],['zh','中文']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Layout Density</label>
            <Select value={settings.density} onChange={setV('density')}>
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Date Format</label>
            <Select value={settings.dateFormat} onChange={setV('dateFormat')}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </div>
        </div>
      </Section>

      {/* ── NOTIFICATIONS ── */}
      <Section icon={Bell} title="Notification Preferences" description="Choose how and when you receive alerts" color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <div className="mb-4 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Alerts</p>
          </div>
          <div className="px-4">
            <Toggle label="Leave Request Updates" description="Notify when leave is submitted, approved, or rejected" value={settings.notifEmailLeave} onChange={tog('notifEmailLeave')} />
            <Toggle label="Payroll Processed" description="Confirm when monthly payroll run is complete" value={settings.notifEmailPayroll} onChange={tog('notifEmailPayroll')} />
            <Toggle label="New Employee Added" description="Alert when a new team member joins the system" value={settings.notifEmailHire} onChange={tog('notifEmailHire')} />
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
            <Smartphone className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Push & In-App</p>
          </div>
          <div className="px-4">
            <Toggle label="Browser Push Notifications" description="Real-time browser alerts for critical updates" value={settings.notifPushAll} onChange={tog('notifPushAll')} />
            <Toggle label="New Message Alerts" description="Notify when you receive a direct message" value={settings.notifNewMessage} onChange={tog('notifNewMessage')} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5">
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Digest Reports</p>
          </div>
          <div className="px-4">
            <Toggle label="Weekly Summary" description="Attendance, leave, and payroll digest every Monday" value={settings.notifWeeklyReport} onChange={tog('notifWeeklyReport')} />
          </div>
        </div>
      </Section>

      {/* ── COMPANY ── */}
      <Section icon={Globe} title="Company Profile" description="Update company-wide information used across the platform" color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Company Name</label><Input value={settings.companyName} onChange={setV('companyName')} /></div>
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">HR Email</label><Input type="email" value={settings.companyEmail} onChange={setV('companyEmail')} /></div>
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Phone</label><Input type="tel" value={settings.companyPhone} onChange={setV('companyPhone')} /></div>
          <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Website</label><Input type="url" value={settings.companyWeb} onChange={setV('companyWeb')} /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Address</label><Input value={settings.companyAddr} onChange={setV('companyAddr')} /></div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Timezone</label>
            <Select value={settings.timezone} onChange={setV('timezone')}>
              {['America/Los_Angeles','America/New_York','Europe/London','Europe/Paris','Asia/Kolkata','Asia/Singapore','Australia/Sydney'].map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Currency</label>
            <Select value={settings.currency} onChange={setV('currency')}>
              {[['USD','$ US Dollar'],['EUR','€ Euro'],['GBP','£ British Pound'],['INR','₹ Indian Rupee'],['SGD','S$ Singapore Dollar'],['AUD','A$ Australian Dollar']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </div>
        </div>
      </Section>

      {/* ── SECURITY ── */}
      <Section icon={Shield} title="Security & Privacy" description="Protect your account and control data policies" color="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
        <Toggle label="Two-Factor Authentication (2FA)" description="Require an OTP on every login for extra security" value={settings.twoFactor} onChange={tog('twoFactor')} />
        <Toggle label="Audit Log" description="Record all admin actions for compliance and review" value={settings.auditLog} onChange={tog('auditLog')} />
        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Session Timeout</label>
            <Select value={settings.sessionTimeout} onChange={setV('sessionTimeout')}>
              {[['15','15 minutes'],['30','30 minutes'],['60','1 hour'],['120','2 hours'],['never','Never']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Data Retention</label>
            <Select value={settings.dataRetention} onChange={setV('dataRetention')}>
              {[['3','3 months'],['6','6 months'],['12','12 months'],['24','24 months'],['60','5 years']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </div>
        </div>
      </Section>

      {/* ── DATA MANAGEMENT ── */}
      <Section icon={Database} title="Data Management" description="Manage LocalStorage data for this demo application" color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label:'Export All Data',   desc:'Download a JSON backup of all app data',           variant: 'secondary' },
            { label:'Import Backup',     desc:'Restore from a previously exported file',           variant: 'secondary' },
            { label:'Reset Demo Data',   desc:'Restore all records to default seed data',          variant: 'secondary' },
            { label:'Clear All Data',    desc:'Wipe all LocalStorage and start fresh',             variant: 'danger' },
          ].map(({ label, desc, variant }) => (
            <Button key={label} variant={variant} className="h-auto py-4 flex flex-col items-start text-left" onClick={() => {
              if (label === 'Clear All Data') {
                localStorage.clear();
                window.location.reload();
              } else {
                toast.success(`${label} completed`);
              }
            }}>
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs opacity-70 mt-0.5 font-normal">{desc}</span>
            </Button>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          ⚠️ All data is stored in your browser's LocalStorage. This is a frontend-only demo application.
        </p>
      </Section>
    </div>
  );
};

export default Settings;
