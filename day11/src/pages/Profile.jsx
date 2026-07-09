import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Save, KeyRound, AlertCircle,
  Mail, Phone, MapPin, Calendar, Shield, Briefcase,
  Link2, AtSign, Hash, Globe, Plus, X as XIcon,
  User, Pencil,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  { id: 'indigo',  cls: 'from-indigo-500 to-violet-500',   ring: 'ring-indigo-500'  },
  { id: 'emerald', cls: 'from-emerald-500 to-teal-500',    ring: 'ring-emerald-500' },
  { id: 'rose',    cls: 'from-rose-500 to-pink-500',       ring: 'ring-rose-500'    },
  { id: 'amber',   cls: 'from-amber-500 to-orange-500',    ring: 'ring-amber-400'   },
  { id: 'sky',     cls: 'from-sky-500 to-blue-600',        ring: 'ring-sky-500'     },
  { id: 'fuchsia', cls: 'from-fuchsia-500 to-purple-600',  ring: 'ring-fuchsia-500' },
];

const SKILL_SUGGESTIONS = ['React', 'HR Management', 'Payroll', 'Recruitment', 'Data Analysis', 'Leadership', 'Python', 'Communication', 'Project Management', 'Excel'];
const STORAGE_KEY = 'ems_profile';

const loadProfile = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* */ }
  const user = (() => { try { return JSON.parse(localStorage.getItem('ems_user') || '{}'); } catch { return {}; } })();
  return {
    firstName:  user.name?.split(' ')[0]  || 'Admin',
    lastName:   user.name?.split(' ').slice(1).join(' ') || 'User',
    email:      user.email || 'admin@ems.com',
    phone:      '+1 555-0100',
    department: 'Administration',
    role:       'System Administrator',
    location:   'San Francisco, CA',
    bio:        'Experienced HR professional and system administrator with 8+ years in workforce management and operational excellence.',
    joinDate:   '2020-01-15',
    github:     '',
    linkedin:   '',
    twitter:    '',
    website:    '',
    skills:     ['HR Management', 'Payroll', 'React'],
    avatarColor:'indigo',
  };
};

const calcCompletion = (form) => {
  const fields = ['firstName','lastName','email','phone','department','role','location','bio','github','linkedin'];
  const filled  = fields.filter((k) => form[k]?.toString().trim());
  const skillBonus = form.skills?.length > 0 ? 1 : 0;
  return Math.round(((filled.length + skillBonus) / (fields.length + 1)) * 100);
};

// ─── Profile Page ─────────────────────────────────────────────────────────────
const Profile = () => {
  const [form,      setForm]      = useState(loadProfile);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwErrors,  setPwErrors]  = useState({});
  const [editMode,  setEditMode]  = useState(false);
  const [skillInput,setSkillInput]= useState('');
  const [isSaving,  setIsSaving]  = useState(false);
  const [isPwSaving,setIsPwSaving] = useState(false);
  const fileRef = useRef();

  const avatarGrad = AVATAR_GRADIENTS.find((g) => g.id === form.avatarColor) || AVATAR_GRADIENTS[0];
  const fullName   = `${form.firstName} ${form.lastName}`.trim();
  const initials   = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase();
  const completion = calcCompletion(form);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); }, [form]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setPw = (k) => (e) => { setPasswords((p) => ({ ...p, [k]: e.target.value })); setPwErrors((p) => ({ ...p, [k]: '' })); };

  const addSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (s && !form.skills.includes(s)) setForm((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };
  const removeSkill = (s) => setForm((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    const updated = { ...JSON.parse(localStorage.getItem('ems_user') || '{}'), name: fullName, email: form.email };
    localStorage.setItem('ems_user', JSON.stringify(updated));
    window.dispatchEvent(new Event('ems-user-changed'));
    setTimeout(() => {
      setIsSaving(false);
      setEditMode(false);
      toast.success('Profile saved successfully');
    }, 600);
  };

  const handleChangePw = (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.current)                              errs.current = 'Enter current password.';
    if (passwords.newPass.length < 8)                   errs.newPass = 'At least 8 characters required.';
    if (passwords.newPass !== passwords.confirm)         errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    
    setIsPwSaving(true);
    setTimeout(() => {
      setIsPwSaving(false);
      setPasswords({ current:'', newPass:'', confirm:'' });
      toast.success('Password updated successfully');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="My Profile" 
        description="Manage your personal information, skills, and account security"
      >
        <Button 
          variant={editMode ? 'secondary' : 'primary'} 
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil className="mr-2 h-4 w-4" /> {editMode ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column ── */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${avatarGrad.cls} text-3xl font-extrabold text-white shadow-xl`}>
                {initials}
              </div>
              {editMode && (
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-md">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{fullName}</h2>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{form.role}</p>
            <p className="text-xs text-slate-400 mt-0.5">{form.department}</p>

            {/* Profile Completion */}
            <div className="w-full mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Profile Completion</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{completion}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${completion}%` }} />
              </div>
              {completion < 100 && (
                <p className="mt-1.5 text-[10px] text-slate-400 text-left">Add more details to reach 100%</p>
              )}
            </div>

            {/* Avatar color picker */}
            {editMode && (
              <div className="w-full mt-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 text-left">Avatar Color</p>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_GRADIENTS.map((g) => (
                    <button key={g.id} onClick={() => setForm((p) => ({ ...p, avatarColor: g.id }))}
                      className={`h-7 w-7 rounded-lg bg-gradient-to-br ${g.cls} transition-transform hover:scale-110 ${form.avatarColor === g.id ? `ring-2 ring-offset-2 ${g.ring} dark:ring-offset-slate-900` : ''}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Status badges */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">● Active</span>
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">Admin</span>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex gap-3 justify-center">
              {[
                { icon: Link2,   val: form.github,   href: form.github,   label: 'GitHub'   },
                { icon: AtSign,  val: form.linkedin, href: form.linkedin, label: 'LinkedIn' },
                { icon: Hash,    val: form.twitter,  href: form.twitter,  label: 'Twitter'  },
                { icon: Globe,   val: form.website,  href: form.website,  label: 'Website'  },
              ].map(({ icon: Icon, val, href, label }, i) => (
                <a key={i} href={val ? href : undefined} target="_blank" rel="noreferrer"
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors ${val ? 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-default'}`}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Card>

          {/* Quick info */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Details</h3>
            {[
              { icon: Mail,     label: 'Email',    val: form.email },
              { icon: Phone,    label: 'Phone',    val: form.phone },
              { icon: MapPin,   label: 'Location', val: form.location },
              { icon: Calendar, label: 'Joined',   val: new Date(form.joinDate).toLocaleDateString('en-US',{month:'long',year:'numeric'}) },
              { icon: Briefcase,label: 'Role',     val: form.role },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase text-slate-400">{label}</p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{val || '—'}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Skills */}
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  {s}
                  {editMode && (
                    <button onClick={() => removeSkill(s)} className="ml-0.5 text-indigo-400 hover:text-rose-500 transition-colors">
                      <XIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editMode && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill…"
                    className="flex-1" />
                  <Button variant="primary" onClick={() => addSkill()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0,6).map((s) => (
                    <button key={s} onClick={() => addSkill(s)}
                      className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Form */}
          <form onSubmit={handleSave}>
            <Card>
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{editMode ? 'Make changes and save below' : 'Click "Edit Profile" to make changes'}</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input disabled={!editMode} value={form.firstName} onChange={set('firstName')} /></div>
                  <div><Label>Last Name</Label><Input disabled={!editMode} value={form.lastName} onChange={set('lastName')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email Address</Label><Input type="email" disabled={!editMode} value={form.email} onChange={set('email')} /></div>
                  <div><Label>Phone</Label><Input type="tel" disabled={!editMode} value={form.phone} onChange={set('phone')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Department</Label><Input disabled={!editMode} value={form.department} onChange={set('department')} /></div>
                  <div><Label>Location</Label><Input disabled={!editMode} value={form.location} onChange={set('location')} placeholder="City, Country" /></div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <textarea rows={3} disabled={!editMode} 
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 resize-none border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${editMode ? '' : 'opacity-70 cursor-not-allowed'}`} 
                    value={form.bio} onChange={set('bio')} />
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Social & Web Links</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k:'github',   icon: Link2,  ph:'https://github.com/username'   },
                      { k:'linkedin', icon: AtSign, ph:'https://linkedin.com/in/name'  },
                      { k:'twitter',  icon: Hash,   ph:'https://twitter.com/handle'    },
                      { k:'website',  icon: Globe,  ph:'https://yoursite.com'          },
                    ].map(({ k, icon: Icon, ph }) => (
                      <div key={k} className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input disabled={!editMode} placeholder={ph} value={form[k]} onChange={set(k)} className="pl-9" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              {editMode && (
                <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                  <Button type="submit" isLoading={isSaving}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              )}
            </Card>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePw}>
            <Card>
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20">
                  <KeyRound className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Change Password</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password securely</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" error={pwErrors.current} value={passwords.current} onChange={setPw('current')} placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" error={pwErrors.newPass} value={passwords.newPass} onChange={setPw('newPass')} placeholder="Min 8 characters" />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input type="password" error={pwErrors.confirm} value={passwords.confirm} onChange={setPw('confirm')} placeholder="••••••••" />
                  </div>
                </div>
                {passwords.newPass && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Password strength</p>
                    <div className="flex gap-1">
                      {[1,2,3,4].map((n) => {
                        const len = passwords.newPass.length;
                        const hasUpper = /[A-Z]/.test(passwords.newPass);
                        const hasNum   = /\d/.test(passwords.newPass);
                        const hasSym   = /[^A-Za-z0-9]/.test(passwords.newPass);
                        const score = [len >= 8, hasUpper, hasNum, hasSym].filter(Boolean).length;
                        return (
                          <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= score ? ['bg-rose-500','bg-amber-400','bg-yellow-400','bg-emerald-500'][score-1] || 'bg-slate-200' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400">{['','Weak','Fair','Good','Strong'][[...[passwords.newPass.length >= 8, /[A-Z]/.test(passwords.newPass), /\d/.test(passwords.newPass), /[^A-Za-z0-9]/.test(passwords.newPass)]].filter(Boolean).length]}</p>
                  </div>
                )}
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-400">
                  <strong>Tip:</strong> Use 8+ characters with uppercase, numbers, and symbols for a strong password.
                </div>
              </CardContent>
              <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                <Button type="submit" variant="danger" isLoading={isPwSaving}>
                  <KeyRound className="mr-2 h-4 w-4" /> Update Password
                </Button>
              </div>
            </Card>
          </form>

          {/* Login Activity */}
          <Card>
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Login Activity</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your last sign-in sessions</p>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { device:'Chrome on Windows 11', location:'San Francisco, CA', time:'Just now',  status:'Current' },
                { device:'Safari on macOS',      location:'San Francisco, CA', time:'2 days ago',status:'Expired' },
                { device:'Mobile App (iOS)',     location:'New York, NY',      time:'5 days ago',status:'Expired' },
              ].map((s) => (
                <div key={s.device} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{s.device}</p>
                    <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
                  </div>
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${s.status === 'Current' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/app/settings" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Manage security settings →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
