import { useEffect, useState } from 'react';
import { X, Save, User } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations'];
const ROLES = {
  Engineering: ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer', 'Senior Engineer'],
  Product:     ['Product Manager', 'Product Owner', 'Business Analyst'],
  Design:      ['UX Designer', 'UI Designer', 'Graphic Designer', 'Product Designer'],
  HR:          ['HR Manager', 'HR Specialist', 'Recruiter', 'Talent Acquisition Lead'],
  Marketing:   ['Marketing Lead', 'Content Strategist', 'SEO Specialist', 'Social Media Manager'],
  Finance:     ['Financial Analyst', 'Accountant', 'Finance Manager', 'Controller'],
  Sales:       ['Sales Rep', 'Account Executive', 'Sales Manager', 'Business Development Manager'],
  Operations:  ['Operations Manager', 'Operations Analyst', 'Project Manager', 'Scrum Master'],
};
const STATUSES = ['Active', 'On Leave', 'Remote', 'Terminated'];
const GENDERS  = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  department: '', role: '', status: 'Active', salary: '',
  joinDate: new Date().toISOString().slice(0, 10), gender: '',
};

const validate = (form) => {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim())  errors.lastName  = 'Last name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  if (!form.department)   errors.department = 'Select a department.';
  if (!form.role)         errors.role = 'Select a role.';
  if (!form.status)       errors.status = 'Select a status.';
  if (!form.salary || isNaN(form.salary) || Number(form.salary) <= 0)
    errors.salary = 'Enter a valid salary.';
  if (!form.joinDate)     errors.joinDate = 'Join date is required.';
  return errors;
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 dark:text-white dark:bg-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-400 bg-rose-50 dark:bg-rose-900/10'
      : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
  }`;

const EmployeeModal = ({ isOpen, onClose, onSave, employee }) => {
  const isEdit = Boolean(employee);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(employee ? { ...employee, salary: String(employee.salary) } : EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: val,
      // Reset role when department changes
      ...(field === 'department' ? { role: '' } : {}),
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onSave({ ...form, salary: Number(form.salary) });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isEdit ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit ? 'Update employee details' : 'Fill in the details to add a new team member'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name *" error={errors.firstName}>
              <input className={inputClass(errors.firstName)} placeholder="Jane" value={form.firstName} onChange={set('firstName')} />
            </Field>
            <Field label="Last Name *" error={errors.lastName}>
              <input className={inputClass(errors.lastName)} placeholder="Cooper" value={form.lastName} onChange={set('lastName')} />
            </Field>
          </div>

          {/* Contact row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address *" error={errors.email}>
              <input type="email" className={inputClass(errors.email)} placeholder="jane@ems.com" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Phone Number *" error={errors.phone}>
              <input type="tel" className={inputClass(errors.phone)} placeholder="+1 555-0100" value={form.phone} onChange={set('phone')} />
            </Field>
          </div>

          {/* Department + Role */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Department *" error={errors.department}>
              <select className={inputClass(errors.department)} value={form.department} onChange={set('department')}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Role *" error={errors.role}>
              <select className={inputClass(errors.role)} value={form.role} onChange={set('role')} disabled={!form.department}>
                <option value="">Select role</option>
                {(ROLES[form.department] || []).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Status + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status *" error={errors.status}>
              <select className={inputClass(errors.status)} value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Gender" error={errors.gender}>
              <select className={inputClass(errors.gender)} value={form.gender} onChange={set('gender')}>
                <option value="">Select gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
          </div>

          {/* Salary + Join Date */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Annual Salary (USD) *" error={errors.salary}>
              <input type="number" min="0" className={inputClass(errors.salary)} placeholder="75000" value={form.salary} onChange={set('salary')} />
            </Field>
            <Field label="Join Date *" error={errors.joinDate}>
              <input type="date" className={inputClass(errors.joinDate)} value={form.joinDate} onChange={set('joinDate')} />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70 shadow-md shadow-indigo-500/30 transition-all"
            >
              {saving
                ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving…</>
                : <><Save className="h-4 w-4" /> {isEdit ? 'Update' : 'Add Employee'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
