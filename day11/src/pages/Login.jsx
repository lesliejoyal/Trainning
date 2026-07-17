import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, AlertCircle, CheckCircle, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const validate = (email, password) => {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
};

const InputField = ({ id, label, type, value, onChange, error, placeholder, rightElement }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        id={id} name={id} type={type} autoComplete={id} value={value} onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-xl border px-4 py-3 text-sm text-slate-900 dark:text-white dark:bg-slate-800/60 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-rose-400 focus:ring-rose-500/30 bg-rose-50 dark:bg-rose-900/10'
            : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500/30 focus:border-indigo-400'
        } ${rightElement ? 'pr-12' : ''}`}
      />
      {rightElement && <div className="absolute inset-y-0 right-0 flex items-center pr-4">{rightElement}</div>}
    </div>
    {error && (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" /> {error}
      </p>
    )}
  </div>
);

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'employee'
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // If already logged in redirect
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/app' : '/portal'} replace />;
  }

  const DEMO = {
    admin: { email: 'admin@thamizha.com', password: 'Admin@123' },
    employee: { email: 'kavitha.kanimozhi@thamizha.com', password: 'Employee@123' },
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setForm({ email: '', password: '' });
    setErrors({});
    setLoginError('');
    setLoginSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (loginError) setLoginError('');
  };

  const fillDemo = () => {
    setForm(DEMO[activeTab]);
    setErrors({});
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form.email, form.password);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setIsLoading(true);
    try {
      const session = await login(form.email, form.password);
      // Check role matches tab
      if (session.role !== activeTab) {
        setLoginError(`These credentials are for ${session.role === 'admin' ? 'Admin' : 'Employee'} login. Please switch tabs.`);
        setIsLoading(false);
        return;
      }
      setLoginSuccess(true);
      setTimeout(() => navigate(session.role === 'admin' ? '/app' : '/portal'), 800);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const featuresByRole = {
    admin: ['Manage all employees & departments', 'Approve leaves & payroll', 'Advanced reports & analytics', 'Full system configuration'],
    employee: ['View personal dashboard & profile', 'Apply for leave & track status', 'Check payslips & salary details', 'Manage tasks & attendance'],
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[480px] lg:flex-col lg:items-center lg:justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 shrink-0">
        <div className="absolute top-0 left-0 h-80 w-80 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-indigo-400/10 -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="relative z-10 max-w-sm text-center text-white space-y-8">
          <div className="inline-flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-white/15 shadow-2xl shadow-black/30 backdrop-blur-sm ring-1 ring-white/20">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Thamizha Thamizhi</h1>
            <p className="mt-3 text-indigo-200 text-base leading-relaxed">
              The smarter way to manage your Tamil workforce — streamlined, powerful, and beautifully designed.
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 text-left"
            >
              {featuresByRole[activeTab].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-indigo-300 flex-shrink-0" />
                  <span className="text-indigo-100 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg mb-3">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Thamizha Thamizhi - Employee Management Portal</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select your role and enter your credentials</p>
            </div>

            {/* Role Tabs */}
            <div className="mb-6 flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              {[
                { key: 'admin', label: 'Admin', Icon: ShieldCheck },
                { key: 'employee', label: 'Employee', Icon: User },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Demo hint */}
            <div className="mb-5 flex items-center justify-between rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-0.5">Demo Credentials</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">{DEMO[activeTab].email}</p>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Auto-fill
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <InputField id="email" label="Email address" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
              <InputField
                id="password" label="Password" type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={handleChange} error={errors.password} placeholder="••••••••"
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700" />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                    <p className="text-sm text-rose-600 dark:text-rose-400">{loginError}</p>
                  </motion.div>
                )}
                {loginSuccess && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Login successful! Redirecting…</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || loginSuccess}
                className="relative w-full flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              >
                {isLoading && !loginSuccess && (
                  <svg className="absolute left-4 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loginSuccess ? 'Signed In ✓' : isLoading ? 'Signing in…' : `Sign in as ${activeTab === 'admin' ? 'Admin' : 'Employee'}`}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-indigo-500">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
