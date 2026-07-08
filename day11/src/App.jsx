import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar  from './components/Topbar';
import Dashboard   from './pages/Dashboard';
import Employees   from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import Analytics   from './pages/Analytics';
import Settings    from './pages/Settings';
import {
  getEmployees, addEmployee,
  updateEmployee, deleteEmployee,
} from './services/employeeService';

/* ───────────────────────────
   Toast System
─────────────────────────── */
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>
            {t.type === 'success' ? '✅' :
             t.type === 'error'   ? '❌' :
             t.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          {t.message}
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────
   Delete Confirm Modal
─────────────────────────── */
function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <div className="modal-title">Delete Employee?</div>
        <div className="modal-text">
          This action cannot be undone. The employee record will be permanently removed from the system.
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────
   App Root
─────────────────────────── */
export default function App() {
  const [employees,     setEmployees]     = useState([]);
  const [editEmployee,  setEditEmployee]  = useState(null);
  const [toasts,        setToasts]        = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ── Toast helpers ── */
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── Load ── */
  const loadEmployees = useCallback(() => {
    getEmployees()
      .then(res => setEmployees(res.data))
      .catch(() => showToast('Failed to load employees', 'error'));
  }, [showToast]);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  /* ── CRUD ── */
  const handleAdd = async (emp) => {
    await addEmployee(emp);
    loadEmployees();
    showToast('Employee added successfully! 🎉');
  };

  const handleUpdate = async (emp) => {
    await updateEmployee(emp.id, emp);
    loadEmployees();
    setEditEmployee(null);
    showToast('Employee updated successfully! ✅');
  };

  const handleDelete = (id) => setConfirmDelete(id);

  const confirmDeleteAction = () => {
    deleteEmployee(confirmDelete)
      .then(() => {
        loadEmployees();
        setConfirmDelete(null);
        showToast('Employee removed', 'info');
      })
      .catch(() => showToast('Failed to delete employee', 'error'));
  };

  const handleEdit = (emp) => setEditEmployee(emp);
  const handleCancel = () => setEditEmployee(null);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar employeeCount={employees.length} />

        <div className="main-wrapper">
          <Topbar />

          <main className="page-content">
            <Routes>
              <Route path="/" element={
                <Dashboard
                  employees={employees}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              } />
              <Route path="/employees" element={
                <Employees
                  employees={employees}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              } />
              <Route path="/add" element={
                <AddEmployee
                  editEmployee={editEmployee}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                />
              } />
              <Route path="/analytics" element={
                <Analytics employees={employees} />
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Global UI overlays */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {confirmDelete && (
        <DeleteModal
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </BrowserRouter>
  );
}