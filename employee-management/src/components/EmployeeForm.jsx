import { useState, useEffect } from "react";

function EmployeeForm({ addEmployee, editEmployee, updateEmployee, onCancel }) {
  const empty = { name: "", department: "", email: "" };
  const [employee, setEmployee] = useState(empty);

  useEffect(() => {
    setEmployee(editEmployee ?? empty);
  }, [editEmployee]);

  const handleChange = (e) =>
    setEmployee({ ...employee, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee.name.trim() || !employee.department.trim() || !employee.email.trim()) return;
    editEmployee ? updateEmployee(employee) : addEmployee(employee);
    setEmployee(empty);
  };

  return (
    <div className={`form-card ${editEmployee ? "editing" : ""}`}>
      {/* Header */}
      <div className="form-card-header">
        <div className="form-card-title">
          {editEmployee ? "✏️ Edit Employee" : "➕ Add Employee"}
        </div>
        <div className="form-card-subtitle">
          {editEmployee
            ? "Update the details below and save"
            : "Fill in the details to register a new employee"}
        </div>
      </div>

      {/* Editing banner */}
      {editEmployee && (
        <div className="editing-banner">
          ✏️ Editing: <strong style={{ marginLeft: 4 }}>{editEmployee.name}</strong>
        </div>
      )}

      <div className="form-divider" />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="form-input-icon">
            <span className="icon">👤</span>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="e.g. Jane Smith"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <div className="form-input-icon">
            <span className="icon">🏢</span>
            <input
              className="form-input"
              type="text"
              name="department"
              placeholder="e.g. Engineering"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="form-input-icon">
            <span className="icon">📧</span>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="e.g. jane@company.com"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {editEmployee ? "💾 Save Changes" : "🚀 Add Employee"}
        </button>

        {editEmployee && (
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            ✕ Cancel Editing
          </button>
        )}
      </form>
    </div>
  );
}

export default EmployeeForm;