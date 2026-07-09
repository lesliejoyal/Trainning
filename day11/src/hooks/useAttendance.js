import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_attendance';

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

const SEED = [
  { id: 'a1',  date: today,       employeeId: '1', employeeName: 'Jane Cooper',    department: 'Engineering', status: 'Present',  checkIn: '09:02', checkOut: '18:05' },
  { id: 'a2',  date: today,       employeeId: '2', employeeName: 'Cody Fisher',    department: 'Product',     status: 'Present',  checkIn: '08:55', checkOut: '17:50' },
  { id: 'a3',  date: today,       employeeId: '3', employeeName: 'Esther Howard',  department: 'Design',      status: 'Absent',   checkIn: '',      checkOut: '' },
  { id: 'a4',  date: today,       employeeId: '4', employeeName: 'Jenny Wilson',   department: 'HR',          status: 'Late',     checkIn: '10:30', checkOut: '18:00' },
  { id: 'a5',  date: today,       employeeId: '6', employeeName: 'Wade Warren',    department: 'Engineering', status: 'Present',  checkIn: '09:00', checkOut: '18:00' },
  { id: 'a6',  date: today,       employeeId: '7', employeeName: 'Floyd Miles',    department: 'Finance',     status: 'Half Day', checkIn: '09:00', checkOut: '13:00' },
  { id: 'a7',  date: yesterday,   employeeId: '1', employeeName: 'Jane Cooper',    department: 'Engineering', status: 'Present',  checkIn: '09:00', checkOut: '18:10' },
  { id: 'a8',  date: yesterday,   employeeId: '2', employeeName: 'Cody Fisher',    department: 'Product',     status: 'Late',     checkIn: '10:15', checkOut: '18:00' },
  { id: 'a9',  date: yesterday,   employeeId: '4', employeeName: 'Jenny Wilson',   department: 'HR',          status: 'Present',  checkIn: '08:50', checkOut: '17:45' },
  { id: 'a10', date: twoDaysAgo,  employeeId: '1', employeeName: 'Jane Cooper',    department: 'Engineering', status: 'Present',  checkIn: '09:05', checkOut: '18:00' },
  { id: 'a11', date: twoDaysAgo,  employeeId: '6', employeeName: 'Wade Warren',    department: 'Engineering', status: 'Absent',   checkIn: '',      checkOut: '' },
  { id: 'a12', date: twoDaysAgo,  employeeId: '7', employeeName: 'Floyd Miles',    department: 'Finance',     status: 'Present',  checkIn: '09:00', checkOut: '18:05' },
];

const genId = () => `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const useAttendance = () => {
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED;
    } catch { return SEED; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = useCallback((data) => {
    setRecords((prev) => [{ ...data, id: genId() }, ...prev]);
  }, []);

  const updateRecord = useCallback((id, data) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, addRecord, updateRecord, deleteRecord };
};
