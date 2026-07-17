import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://6a4b3c8af5eab0bb6b626c33.mockapi.io/employee';

// Helper: split a full name into firstName / lastName
const splitName = (name = '') => {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName  = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

// Helper: merge API record into the shape the app expects
const normalizeEmployee = (apiRecord) => {
  const { firstName, lastName } = splitName(apiRecord.name);
  return {
    id:         String(apiRecord.id),
    firstName,
    lastName,
    email:      apiRecord.email      || '',
    phone:      apiRecord.phone      || '',
    department: apiRecord.department || '',
    role:       apiRecord.role       || '',
    status:     apiRecord.status     || 'Active',
    salary:     apiRecord.salary     || 0,
    joinDate:   apiRecord.joinDate   || new Date().toISOString().slice(0, 10),
    gender:     apiRecord.gender     || '',
    // keep the raw name so PUT requests are easy
    name:       apiRecord.name       || `${firstName} ${lastName}`,
  };
};

// Helper: convert local shape → API payload
const toApiPayload = (data) => ({
  name:       `${data.firstName} ${data.lastName}`.trim(),
  email:      data.email,
  department: data.department,
  phone:      data.phone      || '',
  role:       data.role       || '',
  status:     data.status     || 'Active',
  salary:     data.salary     || 0,
  joinDate:   data.joinDate   || new Date().toISOString().slice(0, 10),
  gender:     data.gender     || '',
});

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Fetch all employees from API ──────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setEmployees(data.map(normalizeEmployee));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Add employee (POST) ───────────────────────────────────────────────────
  const addEmployee = useCallback(async (data) => {
    const payload = toApiPayload(data);
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to add employee: ${res.status}`);
    const created = await res.json();
    const normalized = normalizeEmployee(created);
    setEmployees((prev) => [normalized, ...prev]);
    return normalized;
  }, []);

  // ── Update employee (PUT) ─────────────────────────────────────────────────
  const updateEmployee = useCallback(async (id, data) => {
    const payload = toApiPayload(data);
    const res = await fetch(`${API_URL}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to update employee: ${res.status}`);
    const updated = await res.json();
    const normalized = normalizeEmployee(updated);
    setEmployees((prev) => prev.map((emp) => (emp.id === String(id) ? normalized : emp)));
    return normalized;
  }, []);

  // ── Delete employee (DELETE) ──────────────────────────────────────────────
  const deleteEmployee = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete employee: ${res.status}`);
    setEmployees((prev) => prev.filter((emp) => emp.id !== String(id)));
  }, []);

  // ── Get single employee ───────────────────────────────────────────────────
  const getEmployee = useCallback(
    (id) => employees.find((emp) => emp.id === String(id)),
    [employees],
  );

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    refetch: fetchEmployees,
  };
};
