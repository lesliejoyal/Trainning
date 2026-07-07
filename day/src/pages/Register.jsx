import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    dispatch(login({
      user: { name: `${form.firstName} ${form.lastName}`, email: form.email },
      token: 'adibas-token-' + Date.now()
    }));
    navigate('/dashboard');
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black uppercase mb-2 tracking-tighter">Create Account</h2>
      <p className="text-sm font-medium text-gray-500 mb-8">Join adiClub and get 15% off your first order.</p>
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 text-sm font-bold mb-6">
          {error}
        </div>
      )}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input name="firstName" placeholder="First Name *" required value={form.firstName} onChange={handleChange} />
          <Input name="lastName" placeholder="Last Name *" required value={form.lastName} onChange={handleChange} />
        </div>
        <Input name="email" type="email" placeholder="Email *" required value={form.email} onChange={handleChange} />
        <Input name="password" type="password" placeholder="Password * (min 6 chars)" required value={form.password} onChange={handleChange} />
        <Input name="confirm" type="password" placeholder="Confirm Password *" required value={form.confirm} onChange={handleChange} />

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-4 h-4 accent-black flex-shrink-0" />
          <span className="text-xs font-bold text-gray-600 leading-relaxed">
            I agree to the Adibas <Link to="/about" className="underline">Terms & Conditions</Link> and <Link to="/about" className="underline">Privacy Policy</Link>.
          </span>
        </label>

        <Button type="submit" className="w-full justify-between">Create Account</Button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm font-bold text-gray-600 mb-4">Already have an account?</p>
        <Link to="/login" className="w-full block">
          <Button variant="white" className="w-full justify-between">Log In</Button>
        </Link>
      </div>
    </div>
  );
}
