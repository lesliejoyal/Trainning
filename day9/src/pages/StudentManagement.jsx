import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import Modal from '../components/Modal';
import { useStudentStore } from '../data/store';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

// Empty form template for a student record
const EMPTY_FORM = {
  rollNumber: '',
  name: '',
  department: 'CSE',
  year: 1,
  semester: 1,
  section: 'A',
  gender: 'Male',
  email: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
};

export const StudentManagement = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Open modal for adding a new student
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  // Open modal for editing an existing student
  const openEdit = (student) => {
    setEditing(student);
    setForm({ ...EMPTY_FORM, ...student });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  // Simple validation – ensure required fields are filled and email looks valid
  const validate = () => {
    const errors = {};
    if (!form.rollNumber.trim()) errors.rollNumber = 'Required';
    if (!form.name.trim()) errors.name = 'Required';
    if (!form.email.trim()) errors.email = 'Required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errors.email = 'Invalid email';
    if (!form.phone.trim()) errors.phone = 'Required';
    return errors;
  };

  const handleSave = () => {
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    if (editing) {
      updateStudent(editing.studentId, form);
      toast.success('Student updated');
    } else {
      addStudent(form);
      toast.success('Student added');
    }
    closeModal();
  };

  const handleDelete = (student) => {
    deleteStudent(student.studentId);
    toast.success('Student removed');
  };

  // Filter students based on search query (name, roll number, email)
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    });
  }, [students, search]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Student Management</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, roll no or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <button onClick={openAdd} className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Contact</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.studentId}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar w-9 h-9 rounded bg-slate-200 dark:bg-slate-700" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-blue font-mono">{s.rollNumber}</span></td>
                      <td><span className="badge badge-gray">{s.department}</span></td>
                      <td className="text-slate-600 dark:text-slate-400">{s.year}{['st','nd','rd','th'][s.year-1]}</td>
                      <td className="text-slate-600 dark:text-slate-400">{s.section}</td>
                      <td className="text-slate-500 dark:text-slate-400 text-xs">{s.phone}</td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(s)}
                            className="btn btn-ghost p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s)}
                            className="btn btn-ghost p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={editing ? 'Edit Student' : 'Add New Student'}
          size="lg"
        >
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'rollNumber', label: 'Roll Number', type: 'text', placeholder: 'e.g., CSE001' },
              { key: 'name',       label: 'Full Name',   type: 'text', placeholder: 'Student name' },
              { key: 'email',      label: 'Email',       type: 'email', placeholder: 'email@example.com' },
              { key: 'phone',      label: 'Phone',       type: 'tel',   placeholder: '10‑digit number' },
              { key: 'parentName', label: 'Parent Name', type: 'text', placeholder: 'Parent/Guardian name' },
              { key: 'parentPhone',label: 'Parent Phone',type: 'tel', placeholder: '10‑digit number' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="input-group">
                <label className="label">
                  {label}
                  {['rollNumber','name','email','phone'].includes(key) && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  value={form[key] || ''}
                  onChange={(e) => set(key, e.target.value)}
                  className={`input ${formErrors[key] ? 'ring-2 ring-red-500' : ''}`}
                  placeholder={placeholder}
                />
                {formErrors[key] && <p className="text-xs text-red-500 mt-0.5">{formErrors[key]}</p>}
              </div>
            ))}
            {/* Additional selects for department, year, etc. */}
            <div className="input-group">
              <label className="label">Department</label>
              <select
                value={form.department}
                onChange={(e) => set('department', e.target.value)}
                className="input"
              >
                {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="label">Year</label>
              <select
                value={form.year}
                onChange={(e) => set('year', Number(e.target.value))}
                className="input"
              >
                {[1,2,3,4].map((y) => (
                  <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-gray-800">
            <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">
              {editing ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default StudentManagement;
