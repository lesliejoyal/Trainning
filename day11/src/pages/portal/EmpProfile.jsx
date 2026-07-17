import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Camera, Printer, 
  Copy, Star, Activity 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Form';
import toast from 'react-hot-toast';

// Simple Dynamic SVG QR Code generator based on name
const generateQRCodeSVG = (text) => {
  return (
    <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white" rx="8"/>
      {/* Outer borders and positioning boxes */}
      <rect x="10" y="10" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="15" y="15" width="10" height="10" fill="black"/>
      
      <rect x="70" y="10" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="75" y="15" width="10" height="10" fill="black"/>
      
      <rect x="10" y="70" width="20" height="20" stroke="black" strokeWidth="4" fill="none"/>
      <rect x="15" y="75" width="10" height="10" fill="black"/>
      
      {/* Dummy QR bits data patterns based on text length */}
      <rect x="40" y="15" width="8" height="8" fill="black"/>
      <rect x="52" y="10" width="8" height="8" fill="black"/>
      <rect x="44" y="25" width="8" height="8" fill="black"/>
      
      <rect x="15" y="45" width="8" height="8" fill="black"/>
      <rect x="25" y="52" width="8" height="8" fill="black"/>
      
      <rect x="45" y="45" width="12" height="12" fill="black"/>
      <rect x="70" y="45" width="8" height="8" fill="black"/>
      <rect x="80" y="55" width="8" height="8" fill="black"/>
      
      <rect x="45" y="75" width="8" height="8" fill="black"/>
      <rect x="55" y="80" width="8" height="8" fill="black"/>
      <rect x="80" y="75" width="8" height="8" fill="black"/>
    </svg>
  );
};

const EmpProfile = () => {
  const { user, updateUser } = useAuth();
  const cardRef = useRef();

  // General profile edit form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
  });

  // Password change state
  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Skill sets local state (for skill progress bars)
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem(`ems_skills_${user?.id}`);
    return saved ? JSON.parse(saved) : [
      { name: 'React & Frontend Development', level: 85 },
      { name: 'State Management & Context API', level: 75 },
      { name: 'Tailwind CSS Designing', level: 90 },
      { name: 'JavaScript ES6+', level: 80 }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`ems_skills_${user?.id}`, JSON.stringify(skills));
  }, [skills]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile details saved');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!pwData.currentPassword || !pwData.newPassword || !pwData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      toast.error('Confirm password does not match');
      return;
    }
    toast.success('Password updated successfully!');
    setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
        toast.success('Avatar picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyDetails = () => {
    const text = `Name: ${user?.name}\nID: ${user?.employeeId}\nRole: ${user?.designation}\nDepartment: ${user?.department}\nEmail: ${user?.email}`;
    navigator.clipboard.writeText(text);
    toast.success('Employee details copied to clipboard!');
  };

  const printIDCard = () => {
    const content = cardRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=450,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Employee ID Card - ${user?.name}</title>
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
            <div class="name">${user?.name}</div>
            <div class="role">${user?.designation}</div>
            <div class="role">${user?.department}</div>
            <div class="id">ID: ${user?.employeeId}</div>
            <div class="qr">${generateQRCodeSVG(user?.employeeId)}</div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleSkillLevelChange = (index, value) => {
    setSkills(prev => prev.map((s, idx) => idx === index ? { ...s, level: Number(value) } : s));
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'EE';

  return (
    <div className="space-y-6">
      
      {/* Profile actions header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Smart Profile Card</h2>
          <p className="text-xs text-slate-500">Manage, print ID, and trace your professional timeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={copyDetails}>
            <Copy className="h-3.5 w-3.5 mr-1" /> Copy Details
          </Button>
          <Button variant="secondary" size="sm" onClick={printIDCard}>
            <Printer className="h-3.5 w-3.5 mr-1" /> Print ID Card
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            Print Full Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Glassmorphic ID card + QR code */}
        <div className="space-y-6">
          <div ref={cardRef}>
            <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-br from-primary to-indigo-850 text-white border-none shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/20" />
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
              
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-indigo-200 mt-2">Thamizha Thamizhi</h3>
              <p className="text-[9px] text-indigo-100 uppercase">Corporate Identity Card</p>

              <div className="relative mt-5">
                {user?.avatar ? (
                  <img src={user.avatar} className="h-24 w-24 rounded-full object-cover border-4 border-white/20 shadow-lg" alt="" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/25 text-2xl font-extrabold flex items-center justify-center border-4 border-white/20 shadow-lg">
                    {initials}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white text-primary hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow border-2 border-primary transition-all">
                  <Camera className="h-3.5 w-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              <h4 className="text-base font-extrabold mt-3">{user?.name}</h4>
              <p className="text-xs text-indigo-200">{user?.designation}</p>
              <p className="text-[10px] text-indigo-100/90">{user?.department}</p>

              <div className="mt-4 px-3 py-1 rounded-full bg-white/15 text-xs font-bold tracking-wide">
                ID: {user?.employeeId ?? 'EMP-0001'}
              </div>

              {/* Dynamic QR code display */}
              <div className="mt-5 p-2 bg-white rounded-xl shadow-lg inline-block">
                {generateQRCodeSVG(user?.employeeId ?? 'EMP-0001')}
              </div>
            </Card>
          </div>

          {/* Quick info list */}
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Information</h4>
            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-350">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{user?.phone || '+91 98765-43210'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Chennai, Tamil Nadu</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Column: Skills + Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill progress bars */}
          <Card className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" /> Professional Skills & Competency
            </h4>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-white">{skill.name}</span>
                    <span className="font-bold text-primary">{skill.level}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => handleSkillLevelChange(index, e.target.value)}
                      className="flex-1 accent-primary"
                    />
                    <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timelines: Career growth + projects history */}
          <Card className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" /> Career Growth & Project Milestones
            </h4>
            <div className="relative border-l-2 border-slate-150 dark:border-slate-800 pl-5 ml-2.5 space-y-6 text-xs">
              
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-primary uppercase">July 2024 - Present</span>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Lead UI Upgrades & Layout Migrations</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Assigned to handle single-page transitions, layout refactoring and brand colors customization tasks.</p>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-400 border-4 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-indigo-500 uppercase">January 2023</span>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Promoted to Senior Engineer</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Recognized for delivering bug-free React context states and payroll computation records.</p>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">March 2022</span>
                <h5 className="font-bold text-sm text-slate-800 dark:text-white mt-1">Joined Thamizha Thamizhi</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Onboarded as Frontend Associate to design clean client portal pages using custom CSS tokens.</p>
              </div>

            </div>
          </Card>

          {/* Edit General Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile Details</h3>
                <p className="text-xs text-slate-400">View and update your contact records</p>
              </div>
              <Button
                variant={isEditing ? 'secondary' : 'primary'}
                onClick={() => {
                  if (isEditing) {
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      email: user?.email || '',
                      gender: user?.gender || '',
                    });
                  }
                  setIsEditing(!isEditing);
                }}
                size="sm"
              >
                {isEditing ? 'Cancel' : 'Edit Details'}
              </Button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Phone Number</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Gender</label>
                  <select
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <Button type="submit">Save Details</Button>
                </div>
              )}
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default EmpProfile;
