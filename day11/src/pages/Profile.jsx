import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Mail, Phone, MapPin, Pencil, Printer, Copy, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Form';

const AVATAR_GRADIENTS = [
  { id: 'indigo',  cls: 'from-indigo-500 to-violet-500',   ring: 'ring-indigo-500'  },
  { id: 'emerald', cls: 'from-emerald-500 to-teal-500',    ring: 'ring-emerald-500' },
  { id: 'rose',    cls: 'from-rose-500 to-pink-500',       ring: 'ring-rose-500'    },
  { id: 'amber',   cls: 'from-amber-500 to-orange-500',    ring: 'ring-amber-400'   },
  { id: 'sky',     cls: 'from-sky-500 to-blue-600',        ring: 'ring-sky-500'     },
  { id: 'fuchsia', cls: 'from-fuchsia-500 to-purple-600',  ring: 'ring-fuchsia-500' },
];

const SKILL_SUGGESTIONS = ['HR Strategy', 'Talent Acquisition', 'Payroll Compliance', 'React', 'Leadership', 'Employee Relations', 'Conflict Resolution'];
const STORAGE_KEY = 'ems_profile';

const loadProfile = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* */ }
  const user = (() => { try { return JSON.parse(localStorage.getItem('ems_user') || '{}'); } catch { return {}; } })();
  return {
    firstName:  user.name?.split(' ')[0]  || 'Thamizhaarasan',
    lastName:   user.name?.split(' ').slice(1).join(' ') || 'Admin',
    email:      user.email || 'admin@thamizha.com',
    phone:      '+91 98765-43210',
    department: 'Administration',
    role:       'System Administrator',
    location:   'Chennai, Tamil Nadu',
    bio:        'Experienced HR professional and system administrator with 8+ years in workforce management and operational excellence.',
    joinDate:   '2020-01-15',
    github:     '',
    linkedin:   '',
    twitter:    '',
    website:    '',
    skills:     ['HR Strategy', 'Talent Acquisition', 'Payroll Compliance'],
    avatarColor:'indigo',
  };
};

const calcCompletion = (form) => {
  const fields = ['firstName','lastName','email','phone','department','role','location','bio','github','linkedin'];
  const filled  = fields.filter((k) => form[k]?.toString().trim());
  const skillBonus = form.skills?.length > 0 ? 1 : 0;
  return Math.round(((filled.length + skillBonus) / (fields.length + 1)) * 100);
};

const generateQRCodeSVG = (text) => {
  return (
    <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white" rx="8"/>
      <rect x="10" y="10" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="15" y="15" width="10" height="10" fill="black"/>
      <rect x="70" y="10" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="75" y="15" width="10" height="10" fill="black"/>
      <rect x="10" y="70" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="15" y="75" width="10" height="10" fill="black"/>
      <rect x="40" y="15" width="8" height="8" fill="black"/>
      <rect x="52" y="10" width="8" height="8" fill="black"/>
      <rect x="44" y="25" width="8" height="8" fill="black"/>
      <rect x="15" y="45" width="8" height="8" fill="black"/>
      <rect x="25" y="52" width="8" height="8" fill="black"/>
      <rect x="45" y="45" width="12" height="12" fill="black"/>
      <rect x="70" y="45" width="8" height="8" fill="black"/>
      <rect x="80" y="55" width="8" height="8" fill="black"/>
    </svg>
  );
};

const Profile = () => {
  const [form,      setForm]      = useState(loadProfile);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwErrors,  setPwErrors]  = useState({});
  const [editMode,  setEditMode]  = useState(false);
  const [skillInput,setSkillInput]= useState('');
  const [isSaving,  setIsSaving]  = useState(false);
  const [isPwSaving,setIsPwSaving] = useState(false);
  const fileRef = useRef();
  const cardRef = useRef();

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

  const copyDetails = () => {
    const text = `Name: ${fullName}\nRole: ${form.role}\nDepartment: ${form.department}\nEmail: ${form.email}`;
    navigator.clipboard.writeText(text);
    toast.success('Admin details copied to clipboard!');
  };

  const printIDCard = () => {
    const content = cardRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=450,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Employee ID Card - ${fullName}</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f8fafc; }
            .card { width: 320px; padding: 24px; text-align: center; border-radius: 20px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
            .name { font-size: 20px; font-weight: bold; margin-top: 12px; }
            .role { font-size: 14px; opacity: 0.85; margin-top: 4px; }
            .id { font-size: 16px; font-weight: bold; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 99px; display: inline-block; margin-top: 10px; }
            .qr { margin-top: 20px; background: white; padding: 8px; border-radius: 8px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 style="margin: 0; font-size: 18px; letter-spacing: 1px;">THAMIZHA THAMIZHI</h2>
            <div style="font-size: 10px; opacity: 0.7;">Corporate ID Card</div>
            <div class="name">${fullName}</div>
            <div class="role">${form.role}</div>
            <div class="role">${form.department}</div>
            <div class="id font-bold">ID: ADMIN-001</div>
            <div class="qr">${generateQRCodeSVG('ADMIN-001')}</div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
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
      
      {/* Header controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Profile Card</h2>
          <p className="text-xs text-slate-500">View profile credentials and export ID badge cards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copyDetails}>
            <Copy className="h-3.5 w-3.5 mr-1" /> Copy Details
          </Button>
          <Button variant="secondary" size="sm" onClick={printIDCard}>
            <Printer className="h-3.5 w-3.5 mr-1" /> Print ID Card
          </Button>
          <Button 
            variant={editMode ? 'secondary' : 'primary'} 
            onClick={() => setEditMode(!editMode)}
            size="sm"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column ── */}
        <div className="space-y-5">
          {/* ID Card Display */}
          <div ref={cardRef}>
            <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-br from-primary to-indigo-850 text-white border-none shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/20" />
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
              
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-indigo-200">Thamizha Thamizhi</h3>
              <p className="text-[9px] text-indigo-100 uppercase">Administrator Identity Card</p>

              <div className="relative mt-5">
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

              <h4 className="text-base font-extrabold mt-3">{fullName}</h4>
              <p className="text-xs text-indigo-200">{form.role}</p>
              <p className="text-[10px] text-indigo-100/90">{form.department}</p>

              <div className="mt-4 px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wide">
                ID: ADMIN-001
              </div>

              <div className="mt-5 p-2 bg-white rounded-xl shadow-lg inline-block">
                {generateQRCodeSVG('ADMIN-001')}
              </div>
            </Card>
          </div>

          {/* Quick Details */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Contact Details</h3>
            {[
              { icon: Mail,     label: 'Email',    val: form.email },
              { icon: Phone,    label: 'Phone',    val: form.phone },
              { icon: MapPin,   label: 'Location', val: form.location },
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
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          <form onSubmit={handleSave}>
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Edit Profile details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input disabled={!editMode} value={form.firstName} onChange={set('firstName')} /></div>
                  <div><Label>Last Name</Label><Input disabled={!editMode} value={form.lastName} onChange={set('lastName')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email Address</Label><Input type="email" disabled={!editMode} value={form.email} onChange={set('email')} /></div>
                  <div><Label>Phone</Label><Input type="tel" disabled={!editMode} value={form.phone} onChange={set('phone')} /></div>
                </div>
                <div>
                  <Label>Bio Statement</Label>
                  <textarea rows={3} disabled={!editMode} 
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary resize-none"
                    value={form.bio} onChange={set('bio')} />
                </div>
              </div>
              {editMode && (
                <div className="flex justify-end pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </Card>
          </form>

          {/* Timelines */}
          <Card className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" /> Admin Growth Timeline
            </h4>
            <div className="relative border-l-2 border-slate-150 dark:border-slate-800 pl-5 ml-2.5 space-y-6 text-xs">
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-primary uppercase">2024 - Present</span>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Platform Restructuring Implementation</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Implemented multi-theme layout configurations, customizable colors, and reorderable widgets state.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-400 border-4 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-indigo-500 uppercase">2020</span>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-1">First Joined</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Setup initial seed configuration parameters for payroll rules and leave approval logic.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
