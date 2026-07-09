import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_payroll';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const currentMonth = MONTHS[new Date().getMonth()] ?? 'July';
const prevMonth = MONTHS[(new Date().getMonth() - 1 + 12) % 12] ?? 'June';

const buildRecord = (emp, month, year, status = 'Paid') => {
  const basic     = emp.salary;
  const hra       = Math.round(basic * 0.20);
  const transport = Math.round(basic * 0.05);
  const medical   = Math.round(basic * 0.03);
  const special   = Math.round(basic * 0.07);
  const gross     = basic + hra + transport + medical + special;
  const pf        = Math.round(basic * 0.12);
  const tax       = Math.round(gross * 0.10);
  const insurance = Math.round(basic * 0.02);
  const totalDeductions = pf + tax + insurance;
  const net = gross - totalDeductions;
  return {
    id:            `${emp.id}_${month}_${year}`,
    employeeId:    emp.id,
    employeeName:  emp.name,
    department:    emp.department,
    role:          emp.role,
    month,
    year,
    status,
    earnings: {
      basic,
      hra,
      transport,
      medical,
      special,
      gross,
    },
    deductions: {
      pf,
      tax,
      insurance,
      total: totalDeductions,
    },
    net,
    paidOn: status === 'Paid' ? `${year}-${String(new Date().getMonth()).padStart(2, '0')}-28` : null,
  };
};

const SEED_EMPLOYEES = [
  { id: '1', name: 'Jane Cooper',      department: 'Engineering', role: 'Senior Engineer',     salary: 95000  },
  { id: '2', name: 'Cody Fisher',      department: 'Product',     role: 'Product Manager',     salary: 105000 },
  { id: '3', name: 'Esther Howard',    department: 'Design',      role: 'UX Designer',         salary: 80000  },
  { id: '4', name: 'Jenny Wilson',     department: 'HR',          role: 'HR Manager',          salary: 75000  },
  { id: '6', name: 'Wade Warren',      department: 'Engineering', role: 'Frontend Developer',  salary: 85000  },
  { id: '7', name: 'Floyd Miles',      department: 'Finance',     role: 'Financial Analyst',   salary: 88000  },
  { id: '8', name: 'Ronald Richards',  department: 'Engineering', role: 'DevOps Engineer',     salary: 98000  },
];

const SEED = [
  ...SEED_EMPLOYEES.map((e) => buildRecord(e, currentMonth, 2026, 'Paid')),
  ...SEED_EMPLOYEES.map((e) => buildRecord(e, prevMonth,    2026, 'Paid')),
  // One pending for current month
  buildRecord(SEED_EMPLOYEES[3], currentMonth, 2026, 'Pending'),
].filter((r, idx, arr) => arr.findIndex((x) => x.id === r.id) === idx); // dedupe

export const usePayroll = () => {
  const [records, setRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED;
    } catch { return SEED; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const updateStatus = useCallback((id, status) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, paidOn: status === 'Paid' ? new Date().toISOString().slice(0, 10) : null }
          : r
      )
    );
  }, []);

  const generatePayslips = useCallback((month, year) => {
    setRecords((prev) => {
      const existing = new Set(prev.map((r) => r.id));
      const newRecords = SEED_EMPLOYEES
        .map((e) => buildRecord(e, month, year, 'Pending'))
        .filter((r) => !existing.has(r.id));
      return [...newRecords, ...prev];
    });
  }, []);

  return { records, updateStatus, generatePayslips, SEED_EMPLOYEES };
};
