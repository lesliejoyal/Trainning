import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EmployeeLayout from './components/layout/EmployeeLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useSettings } from './hooks/useSettings';

// Employee Portal Pages
import EmpDashboard from './pages/portal/EmpDashboard';
import EmpProfile from './pages/portal/EmpProfile';
import EmpAttendance from './pages/portal/EmpAttendance';
import EmpLeaves from './pages/portal/EmpLeaves';
import EmpPayroll from './pages/portal/EmpPayroll';
import EmpTasks from './pages/portal/EmpTasks';
import EmpNotifications from './pages/portal/EmpNotifications';
import EmpCalendar from './pages/portal/EmpCalendar';
import EmpSettings from './pages/portal/EmpSettings';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  useSettings(); // Apply theme settings globally on app boot

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin app routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute requireRole="admin">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Protected Employee portal routes */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute requireRole="employee">
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmpDashboard />} />
            <Route path="profile" element={<EmpProfile />} />
            <Route path="attendance" element={<EmpAttendance />} />
            <Route path="leaves" element={<EmpLeaves />} />
            <Route path="payroll" element={<EmpPayroll />} />
            <Route path="tasks" element={<EmpTasks />} />
            <Route path="notifications" element={<EmpNotifications />} />
            <Route path="calendar" element={<EmpCalendar />} />
            <Route path="settings" element={<EmpSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-slate-800 dark:text-white',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #334155)',
              borderRadius: '1rem',
              padding: '12px 16px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
