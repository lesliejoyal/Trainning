import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Mock user credentials stored in localStorage seed
const MOCK_USER = {
  email: 'admin@ems.com',
  password: 'Admin@123',
  name: 'Admin User',
  role: 'admin',
};

const validate = (email, password) => {
  const errors = {};
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
};

const InputField = ({ id, label, type, value, onChange, error, placeholder, rightElement }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-lg border px-4 py-2.5 text-sm text-slate-900 dark:text-white dark:bg-slate-800/60 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-rose-400 focus:ring-rose-500 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/10'
            : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
        } ${rightElement ? 'pr-10' : ''}`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate
    const validationErrors = validate(formData.email, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. Simulate network call
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    // 3. Check credentials against mock user
    if (formData.email === MOCK_USER.email && formData.password === MOCK_USER.password) {
      const userSession = {
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        role: MOCK_USER.role,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem('ems_user', JSON.stringify(userSession));
      setLoginSuccess(true);
      setTimeout(() => navigate('/app'), 800);
    } else {
      setLoginError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* ===== Left: Branding Panel ===== */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/20 translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="relative z-10 max-w-md text-center text-white space-y-8">
          <div className="inline-flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-white/20 shadow-lg shadow-black/20 backdrop-blur-sm">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Welcome to EMS Portal</h1>
            <p className="mt-4 text-lg text-indigo-200">
              The smarter way to manage your entire workforce — streamlined, powerful, and beautifully designed.
            </p>
          </div>
          <div className="space-y-4 text-left">
            {[
              'Manage employees and departments',
              'Track performance and reviews',
              'Real-time analytics & reporting',
              'Secure, role-based access',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-300 flex-shrink-0" />
                <span className="text-indigo-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Right: Login Form ===== */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Employment Management System</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Learn more
                </Link>
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="mb-6 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-3">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Demo Credentials</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Email: <strong>admin@ems.com</strong></p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Password: <strong>Admin@123</strong></p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <InputField
                id="email"
                label="Email address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="admin@ems.com"
              />

              <InputField
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>

              {/* Server-side error */}
              {loginError && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                  <p className="text-sm text-rose-600 dark:text-rose-400">{loginError}</p>
                </div>
              )}

              {/* Success feedback */}
              {loginSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Login successful! Redirecting…</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || loginSuccess}
                className="relative w-full flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading && !loginSuccess && (
                  <svg className="absolute left-4 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loginSuccess ? 'Signed In ✓' : isLoading ? 'Signing in…' : 'Sign in'}
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
