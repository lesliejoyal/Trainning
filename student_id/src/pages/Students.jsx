import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import Modal from '../components/Modal';
import { useStudentStore } from '../data/store';
import toast from 'react-hot-toast';
import {
  Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight,
  User, Filter, Download
} from 'lucide-react';
import { format } from 'date-fns';

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-600', 'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-600',      'from-purple-500 to-fuchsia-600',
];

const getAvatar = (name = '') => {
  const init = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return { init, color };
};

const EMPTY_FORM = {
  rollNumber: '', name: '', department: 'CSE', course: 'B.Tech',
  year: 1, semester: 1, section: 'A', gender: 'Male',
  email: '', phone: '', address: '', parentName: '', parentPhone: '',
};

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE'];
const SECTIONS = ['A', 'B', 'C', 'D'];

export const Students = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filtering + search
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
      const matchDept = !deptFilter || s.department === deptFilter;
      const matchYear = !yearFilter || String(s.year) === yearFilter;
      return matchSearch && matchDept && matchYear;
    });
  }, [students, search, deptFilter, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...EMPTY_FORM, ...s }); setFormErrors({}); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const validate = () => {
    const e = {};
    if (!form.rollNumber.trim()) e.rollNumber = 'Required';
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    if (editing) {
      updateStudent(editing.studentId, form);
      toast.success('Student updated successfully!');
    } else {
      addStudent(form);
      toast.success('Student added successfully!');
    }
    closeModal();
  };

  const handleDelete = (s) => {
    deleteStudent(s.studentId);
    setDeleteConfirm(null);
    toast.success(`${s.name} removed.`);
  };

  const exportCSV = () => {
    const headers = ['Roll No', 'Name', 'Department', 'Year', 'Semester', 'Section', 'Gender', 'Email', 'Phone'];
    const rows = students.map((s) => [s.rollNumber, s.name, s.department, s.year, s.semester, s.section, s.gender, s.email, s.phone]);
    let csv = headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    toast.success('Exported to CSV!');
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Students</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {students.length} total · {filtered.length} shown
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn btn-secondary gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={openAdd} className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, roll no or email…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input pl-10"
              />
            </div>
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }} className="input sm:w-44">
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className="input sm:w-36">
              <option value="">All Years</option>
              {[1,2,3,4].map((y) => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
            </select>
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
                {paged.length > 0 ? paged.map((s) => {
                  const { init, color } = getAvatar(s.name);
                  return (
                    <tr key={s.studentId}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`avatar w-9 h-9 text-xs bg-gradient-to-br ${color} shrink-0`}>{init}</div>
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
                            onClick={() => setDeleteConfirm(s)}
                            className="btn btn-ghost p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400">
                      <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No students found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-gray-800">
              <p className="text-xs text-slate-500">Page {page} of {totalPages} · {filtered.length} results</p>
              <div className="flex gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1} className="btn btn-secondary px-3 py-2 text-xs">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page===totalPages} className="btn btn-secondary px-3 py-2 text-xs">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Student' : 'Add New Student'} size="lg">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'rollNumber', label: 'Roll Number', type: 'text', placeholder: 'e.g. CSE001' },
            { key: 'name',       label: 'Full Name',   type: 'text', placeholder: 'Student name' },
            { key: 'email',      label: 'Email',       type: 'email', placeholder: 'email@example.com' },
            { key: 'phone',      label: 'Phone',       type: 'tel',   placeholder: '10-digit number' },
            { key: 'parentName', label: 'Parent Name', type: 'text',  placeholder: 'Parent/Guardian name' },
            { key: 'parentPhone',label: 'Parent Phone',type: 'tel',   placeholder: '10-digit number' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="input-group">
              <label className="label">{label} {['rollNumber','name','email','phone'].includes(key) && <span className="text-red-500">*</span>}</label>
              <input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)} className={`input ${formErrors[key] ? 'ring-2 ring-red-500' : ''}`} placeholder={placeholder} />
              {formErrors[key] && <p className="text-xs text-red-500 mt-0.5">{formErrors[key]}</p>}
            </div>
          ))}

          <div className="input-group">
            <label className="label">Department</label>
            <select value={form.department} onChange={(e) => set('department', e.target.value)} className="input">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Course</label>
            <select value={form.course} onChange={(e) => set('course', e.target.value)} className="input">
              {['B.Tech', 'M.Tech', 'MBA', 'BCA', 'MCA'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Year</label>
            <select value={form.year} onChange={(e) => set('year', Number(e.target.value))} className="input">
              {[1,2,3,4].map((y) => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Semester</label>
            <select value={form.semester} onChange={(e) => set('semester', Number(e.target.value))} className="input">
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Section</label>
            <select value={form.section} onChange={(e) => set('section', e.target.value)} className="input">
              {SECTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Gender</label>
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className="input">
              {['Male', 'Female', 'Other'].map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="input-group sm:col-span-2">
            <label className="label">Address</label>
            <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className="input" placeholder="Full address" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-gray-800">
          <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">
            {editing ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Deletion" size="sm">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            Are you sure you want to delete
          </p>
          <p className="font-bold text-slate-900 dark:text-white text-lg mt-1">{deleteConfirm?.name}?</p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">This action cannot be undone.</p>
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Students;
