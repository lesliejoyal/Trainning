import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

// Hardcoded credentials — no backend needed
const CREDENTIALS = [
  { email: 'admin@sms.local',    password: 'admin123',    name: 'Admin User',    role: 'admin' },
  { email: 'teacher1@sms.local', password: 'teacher123',  name: 'Mr. John Smith', role: 'teacher' },
  { email: 'teacher2@sms.local', password: 'teacher456',  name: 'Ms. Sarah Johnson', role: 'teacher' },
];

const SESSION_KEY = 'sms_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const match = CREDENTIALS.find(
      (c) => c.email === email.trim().toLowerCase() && c.password === password
    );
    if (!match) return { success: false, message: 'Invalid email or password' };

    const { password: _pw, ...userData } = match;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return { success: true, data: userData };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
