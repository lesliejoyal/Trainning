import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_employees';

// Seed data shown when no localStorage data exists
const SEED_EMPLOYEES = [
  { id: '1', firstName: 'Jane',    lastName: 'Cooper',   email: 'jane.cooper@ems.com',   phone: '+1 555-0101', department: 'Engineering', role: 'Senior Engineer',      status: 'Active',     salary: 95000,  joinDate: '2022-03-15', gender: 'Female' },
  { id: '2', firstName: 'Cody',    lastName: 'Fisher',   email: 'cody.fisher@ems.com',    phone: '+1 555-0102', department: 'Product',     role: 'Product Manager',      status: 'Active',     salary: 105000, joinDate: '2021-07-01', gender: 'Male'   },
  { id: '3', firstName: 'Esther',  lastName: 'Howard',   email: 'esther.howard@ems.com',  phone: '+1 555-0103', department: 'Design',      role: 'UX Designer',          status: 'On Leave',   salary: 80000,  joinDate: '2023-01-10', gender: 'Female' },
  { id: '4', firstName: 'Jenny',   lastName: 'Wilson',   email: 'jenny.wilson@ems.com',   phone: '+1 555-0104', department: 'HR',          role: 'HR Manager',           status: 'Active',     salary: 75000,  joinDate: '2020-11-20', gender: 'Female' },
  { id: '5', firstName: 'Kristin', lastName: 'Watson',   email: 'kristin.watson@ems.com', phone: '+1 555-0105', department: 'Marketing',   role: 'Marketing Lead',       status: 'Terminated', salary: 70000,  joinDate: '2019-05-05', gender: 'Female' },
  { id: '6', firstName: 'Wade',    lastName: 'Warren',   email: 'wade.warren@ems.com',    phone: '+1 555-0106', department: 'Engineering', role: 'Frontend Developer',   status: 'Active',     salary: 85000,  joinDate: '2022-08-22', gender: 'Male'   },
  { id: '7', firstName: 'Floyd',   lastName: 'Miles',    email: 'floyd.miles@ems.com',    phone: '+1 555-0107', department: 'Finance',     role: 'Financial Analyst',    status: 'Active',     salary: 88000,  joinDate: '2021-02-14', gender: 'Male'   },
  { id: '8', firstName: 'Ronald',  lastName: 'Richards', email: 'ronald.r@ems.com',       phone: '+1 555-0108', department: 'Engineering', role: 'DevOps Engineer',      status: 'Remote',     salary: 98000,  joinDate: '2022-06-01', gender: 'Male'   },
];

const generateId = () => `emp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const useEmployees = () => {
  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_EMPLOYEES;
    } catch {
      return SEED_EMPLOYEES;
    }
  });

  // Persist to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = useCallback((data) => {
    const newEmployee = { ...data, id: generateId(), joinDate: data.joinDate || new Date().toISOString().slice(0, 10) };
    setEmployees((prev) => [newEmployee, ...prev]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((id, data) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp)));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const getEmployee = useCallback((id) => employees.find((emp) => emp.id === id), [employees]);

  return { employees, addEmployee, updateEmployee, deleteEmployee, getEmployee };
};
