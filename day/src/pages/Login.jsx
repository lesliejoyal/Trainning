import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({
      user: { name: email === 'admin@adibas.com' ? 'Admin' : 'Adibas Member', email },
      token: 'adibas-token-123'
    }));
    navigate(email === 'admin@adibas.com' ? '/admin' : '/dashboard');
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Log in</h2>
      <p className="text-xs text-gray-500 font-bold mb-4">Hint: use admin@adibas.com to access Admin Panel.</p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input 
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email *"
          />
        </div>

        <div>
          <Input 
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password *"
          />
        </div>

        <div>
          <Button type="submit" className="w-full justify-between">
            Log in
          </Button>
        </div>
      </form>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Join the club. Get rewarded.</h3>
        <p className="text-sm font-medium mb-6 text-gray-700">Join Adibas Club and get 15% off your next purchase and full access to everything Adibas.</p>
        <Link to="/register" className="w-full block">
          <Button variant="white" className="w-full justify-between">Join the club</Button>
        </Link>
      </div>
    </div>
  );
}
