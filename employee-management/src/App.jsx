import { useEffect, useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeService";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ── fetch all employees ── */
  const loadEmployees = () => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => showToast("Failed to load employees", "error"));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* ── toast helper ── */
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  /* ── CRUD handlers ── */
  const insertEmployee = (employee) => {
    addEmployee(employee)
      .then(() => { loadEmployees(); showToast("Employee added successfully! 🎉"); })
      .catch(() => showToast("Failed to add employee", "error"));
  };

  const updateEmployeeHandler = (employee) => {
    updateEmployee(employee.id, employee)
      .then(() => {
        loadEmployees();
        setEditEmployee(null);
        showToast("Employee updated successfully! ✅");
      })
      .catch(() => showToast("Failed to update employee", "error"));
  };

  const deleteEmployeeHandler = () => {
    deleteEmployee(confirmDelete)
      .then(() => {
        loadEmployees();
        setConfirmDelete(null);
        showToast("Employee removed", "info");
      })
      .catch(() => showToast("Failed to delete employee", "error"));
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── derived stats ── */
  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))];

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-icon">👥</div>
          <div>
            <div className="navbar-title">EmpManager Pro</div>
            <div className="navbar-subtitle">Human Resources</div>
          </div>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-secondary btn-sm">📊 Reports</button>
          <button className="btn btn-primary btn-sm" onClick={() => setEditEmployee(null)}>
            ＋ New Employee
          </button>
        </div>
      </nav>

      <div className="app-container">
        {/* ── STATS ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">👥</div>
            <div>
              <div className="stat-number">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🏢</div>
            <div>
              <div className="stat-number">{departments.length}</div>
              <div className="stat-label">Departments</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div>
              <div className="stat-number">{employees.length}</div>
              <div className="stat-label">Active Staff</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">📅</div>
            <div>
              <div className="stat-number">
                {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <div className="stat-label">Current Period</div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="main-content">
          <EmployeeForm
            addEmployee={insertEmployee}
            editEmployee={editEmployee}
            updateEmployee={updateEmployeeHandler}
            onCancel={() => setEditEmployee(null)}
          />
          <EmployeeList
            employees={employees}
            onDelete={(id) => setConfirmDelete(id)}
            onEdit={handleEdit}
            departments={departments}
          />
        </div>
      </div>

      {/* ── TOASTS ── */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
            {t.message}
          </div>
        ))}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Delete Employee?</div>
            <div className="modal-text">
              This action cannot be undone. The employee record will be permanently removed from
              the system.
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={deleteEmployeeHandler}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;