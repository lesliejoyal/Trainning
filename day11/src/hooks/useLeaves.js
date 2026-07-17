import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_leaves';
const SEED_VERSION = 'v2_tamil_names';
const VERSION_KEY  = 'ems_leaves_version';
// Clear stale data if seed version changed
if (localStorage.getItem(VERSION_KEY) !== SEED_VERSION) {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
}

const d = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

const SEED = [
  { id: 'l1', employeeId: '1', employeeName: 'Kavitha Kanimozhi',   department: 'Engineering', type: 'Annual Leave',    from: d(2),   to: d(4),   days: 3, reason: 'Family vacation',       status: 'Pending',  appliedOn: d(-1) },
  { id: 'l2', employeeId: '2', employeeName: 'Arivoli Subramanian', department: 'Product',     type: 'Sick Leave',      from: d(-3),  to: d(-2),  days: 2, reason: 'Flu and fever',          status: 'Approved', appliedOn: d(-5) },
  { id: 'l3', employeeId: '3', employeeName: 'Oviya Thamarai',      department: 'Design',      type: 'Casual Leave',    from: d(-7),  to: d(-7),  days: 1, reason: 'Personal errand',        status: 'Approved', appliedOn: d(-9) },
  { id: 'l4', employeeId: '4', employeeName: 'Meenakshi Nandhini',  department: 'HR',          type: 'Annual Leave',    from: d(10),  to: d(14),  days: 5, reason: 'International trip',     status: 'Pending',  appliedOn: d(0)  },
  { id: 'l5', employeeId: '6', employeeName: 'Elango Murugan',      department: 'Engineering', type: 'Sick Leave',      from: d(-2),  to: d(-1),  days: 2, reason: 'Doctor appointment',     status: 'Rejected', appliedOn: d(-4) },
  { id: 'l6', employeeId: '7', employeeName: 'Vikram Ramasamy',     department: 'Finance',     type: 'Paternity Leave', from: d(30),  to: d(45),  days: 15,reason: 'Paternity leave',        status: 'Approved', appliedOn: d(-2) },
  { id: 'l7', employeeId: '8', employeeName: 'Arulozhi Senthil',    department: 'Engineering', type: 'Casual Leave',    from: d(1),   to: d(1),   days: 1, reason: 'Home repair emergency',  status: 'Pending',  appliedOn: d(0)  },
];

const genId = () => `lv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const useLeaves = () => {
  const [leaves, setLeaves] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED;
    } catch { return SEED; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
  }, [leaves]);

  const applyLeave = useCallback((data) => {
    setLeaves((prev) => [{ ...data, id: genId(), status: 'Pending', appliedOn: new Date().toISOString().slice(0, 10) }, ...prev]);
  }, []);

  const updateStatus = useCallback((id, status) => {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const deleteLeave = useCallback((id) => {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { leaves, applyLeave, updateStatus, deleteLeave };
};
