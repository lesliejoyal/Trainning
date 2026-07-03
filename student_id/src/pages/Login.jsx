import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { LogIn, GraduationCap, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({ email: 'admin@sms.local', password: 'admin123' });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && !loading) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, loading, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
    const result = await login(form.email, form.password);
    setSubmitting(false);
    if (result.success) {
      toast.success(`Welcome back, ${result.data.name.split(' ')[0]}! 👋`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900" />
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 60% 80%, #ec4899 0%, transparent 40%)' }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 text-white relative">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl ring-2 ring-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            EduTrack<br />
            <span className="text-violet-300">Student Management</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            A complete, offline-first student management system. Track attendance, manage students, and generate insightful reports.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['✅ Attendance Tracking', '📊 Reports & Analytics', '🎓 Student CRUD', '🌑 Dark Mode'].map((f) => (
              <span key={f} className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-white/80">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">EduTrack</h1>
          </div>

          <div className="card-glass p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Sign In</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Please sign in to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="input-group">
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={`input pl-10 ${errors.email ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="input-group">
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className={`input pl-10 pr-10 ${errors.password ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full py-3 text-base"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <><LogIn className="w-5 h-5" />Sign In</>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3">🔑 Demo Credentials</p>
              <div className="space-y-2">
                {[
                  { label: 'Admin', email: 'admin@sms.local', password: 'admin123' },
                  { label: 'Teacher', email: 'teacher1@sms.local', password: 'teacher123' },
                ].map(({ label, email, password }) => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => fillDemo(email, password)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-xs border border-slate-200 dark:border-gray-700"
                  >
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300">{label}:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">{email}</span>{' '}
                    <span className="text-slate-400 dark:text-slate-500">/ {password}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
