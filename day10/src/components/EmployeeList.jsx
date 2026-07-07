import { useState, useMemo } from "react";

/* Returns up to 2 uppercase initials from a name string */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

function EmployeeList({ employees, onDelete, onEdit, departments }) {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      const matchSearch =
        emp.name?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.department?.toLowerCase().includes(q);
      const matchDept = filterDept ? emp.department === filterDept : true;
      return matchSearch && matchDept;
    });
  }, [employees, search, filterDept]);

  return (
    <div className="table-card">
      {/* ── Table Header / Search bar ── */}
      <div className="table-header">
        <div className="table-title-section">
          <div className="table-title">Employee Directory</div>
          <div className="table-count">
            {filtered.length} of {employees.length} employee
            {employees.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="search-filter-bar">
          {/* Search */}
          <div className="search-box">
            <span className="icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department filter */}
          <select
            className="filter-select"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {(search || filterDept) && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setSearch(""); setFilterDept(""); }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Table or Empty State ── */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{employees.length === 0 ? "🧑‍💼" : "🔍"}</div>
          <div className="empty-title">
            {employees.length === 0 ? "No employees yet" : "No results found"}
          </div>
          <div className="empty-subtitle">
            {employees.length === 0
              ? "Add your first employee using the form on the left."
              : "Try adjusting your search term or department filter."}
          </div>
        </div>
      ) : (
        <table className="emp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((employee) => (
              <tr key={employee.id}>
                {/* ID */}
                <td>
                  <span className="id-badge">#{employee.id}</span>
                </td>

                {/* Name + avatar */}
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-avatar">{getInitials(employee.name)}</div>
                    <div>
                      <div className="emp-name">{employee.name}</div>
                    </div>
                  </div>
                </td>

                {/* Department badge */}
                <td>
                  <span className="dept-badge">{employee.department}</span>
                </td>

                {/* Email */}
                <td className="email-cell">{employee.email}</td>

                {/* Actions */}
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit btn-sm"
                      onClick={() => onEdit(employee)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(employee.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeList;