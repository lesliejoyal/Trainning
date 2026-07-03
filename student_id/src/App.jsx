import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login }      from './pages/Login';
import { Dashboard }  from './pages/Dashboard';
import { Students }   from './pages/Students';
import { Attendance } from './pages/Attendance';
import { Reports }    from './pages/Reports';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute><Students /></ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute><Attendance /></ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute><Reports /></ProtectedRoute>
            } />

            <Route path="/unauthorized" element={
              <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
                <p className="text-slate-500">You don't have permission to access this page.</p>
                <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
              </div>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            className: '!rounded-xl !shadow-xl !text-sm !font-medium',
            duration: 3500,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
