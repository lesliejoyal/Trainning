import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// ── Demo credentials ────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 'admin-1',
    email: 'admin@thamizha.com',
    password: 'Admin@123',
    name: 'Thamizhaarasan Admin',
    role: 'admin',
    avatar: null,
  },
  {
    id: '1',
    email: 'kavitha.kanimozhi@thamizha.com',
    password: 'Employee@123',
    name: 'Kavitha Kanimozhi',
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Engineer',
    joinDate: '2022-03-15',
    phone: '+91 98765-43210',
    gender: 'Female',
    employeeId: 'EMP-0001',
    avatar: null,
  },
  {
    id: '2',
    email: 'arivoli.subramanian@thamizha.com',
    password: 'Employee@123',
    name: 'Arivoli Subramanian',
    role: 'employee',
    department: 'Product',
    designation: 'Product Manager',
    joinDate: '2021-07-01',
    phone: '+91 98765-43211',
    gender: 'Male',
    employeeId: 'EMP-0002',
    avatar: null,
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ems_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    await new Promise((r) => setTimeout(r, 900));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password.');
    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      department: found.department ?? null,
      designation: found.designation ?? null,
      joinDate: found.joinDate ?? null,
      phone: found.phone ?? null,
      gender: found.gender ?? null,
      employeeId: found.employeeId ?? null,
      avatar: found.avatar ?? null,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem('ems_user', JSON.stringify(session));
    setUser(session);
    window.dispatchEvent(new Event('ems-user-changed'));
    return session;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ems_user');
    setUser(null);
    window.dispatchEvent(new Event('ems-user-changed'));
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('ems_user', JSON.stringify(next));
      window.dispatchEvent(new Event('ems-user-changed'));
      return next;
    });
  }, []);

  // Sync across tabs
  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem('ems_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch { /* */ }
    };
    window.addEventListener('storage', sync);
    window.addEventListener('ems-user-changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('ems-user-changed', sync);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
