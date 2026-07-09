import { X, Mail, Phone, Briefcase, Calendar, DollarSign, User2, Building2, Shield } from 'lucide-react';

const statusColors = {
  Active:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'On Leave': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Remote:     'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
  Terminated: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
};

const avatarColors = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
];

const getAvatarColor = (name = '') => avatarColors[name.charCodeAt(0) % avatarColors.length];

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
      <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900 dark:text-white break-all">{value || '—'}</p>
    </div>
  </div>
);

const EmployeeViewModal = ({ isOpen, employee, onClose, onEdit }) => {
  if (!isOpen || !employee) return null;

  const fullName  = `${employee.firstName} ${employee.lastName}`;
  const initials  = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
  const colorClass = getAvatarColor(fullName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header: Avatar + Name */}
        <div className="relative p-6 pb-4">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-xl font-extrabold text-white shadow-lg`}>
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{fullName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{employee.role}</p>
              <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[employee.status] || ''}`}>
                {employee.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 px-4">
            <InfoRow icon={Mail}      label="Email"      value={employee.email} />
            <InfoRow icon={Phone}     label="Phone"      value={employee.phone} />
            <InfoRow icon={Building2} label="Department" value={employee.department} />
            <InfoRow icon={Briefcase} label="Role"       value={employee.role} />
            <InfoRow icon={Shield}    label="Status"     value={employee.status} />
            <InfoRow icon={User2}     label="Gender"     value={employee.gender} />
            <InfoRow icon={DollarSign}label="Salary"     value={`$${Number(employee.salary).toLocaleString()} / yr`} />
            <InfoRow icon={Calendar}  label="Join Date"  value={new Date(employee.joinDate).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 p-4">
          <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Close
          </button>
          <button onClick={onEdit} className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/30 transition-colors">
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
