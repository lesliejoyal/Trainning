import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useStudentStore } from '../data/store';
import toast from 'react-hot-toast';
import {
  Save, RotateCcw, Users, CheckCircle, XCircle, Clock,
  CheckCheck, Search, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-600', 'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-600',      'from-purple-500 to-fuchsia-600',
];
const getAvatar = (name = '') => ({
  init: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
  color: AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length],
});

export const Attendance = () => {
  const { students, getAttendance, saveAttendance } = useStudentStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Local attendance state per date — initialise from store
  const [attendanceMap, setAttendanceMap] = useState(() => getAttendance(selectedDate));

  // When date changes, reload from store
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAttendanceMap(getAttendance(date));
  };

  const handleRadio = (studentId, status) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const next = {};
    filteredStudents.forEach((s) => { next[s.studentId] = status; });
    setAttendanceMap((prev) => ({ ...prev, ...next }));
    toast.success(`Marked all visible students as ${status}`);
  };

  const handleReset = () => {
    if (window.confirm('Reset attendance for this date?')) {
      setAttendanceMap({});
    }
  };

  const handleSave = async () => {
    const marked = Object.entries(attendanceMap).filter(([, v]) => v !== 'Not Marked');
    if (marked.length === 0) {
      toast.error('Mark at least one student before saving.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async
    saveAttendance(selectedDate, attendanceMap);
    setSaving(false);
    toast.success(`Attendance saved for ${format(new Date(selectedDate + 'T00:00:00'), 'MMM d, yyyy')}!`);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q);
      const matchDept = !deptFilter || s.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [students, search, deptFilter]);

  // Stats
  const presentCount = Object.values(attendanceMap).filter((v) => v === 'Present').length;
  const absentCount  = Object.values(attendanceMap).filter((v) => v === 'Absent').length;
  const markedCount  = presentCount + absentCount;

  const departments = [...new Set(students.map((s) => s.department))];
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Attendance</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Mark attendance for {isToday ? 'Today' : format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input w-auto"
            />
          </div>
        </div>

        {/* Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total',      value: filteredStudents.length, icon: Users,        color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
            { label: 'Marked',     value: markedCount,             icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20'   },
            { label: 'Present',    value: presentCount,            icon: CheckCircle,  color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Absent',     value: absentCount,             icon: XCircle,      color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-900/20'     },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input sm:w-44">
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
            <button onClick={() => markAll('Present')} className="btn btn-success gap-2 whitespace-nowrap">
              <CheckCheck className="w-4 h-4" /> Mark All Present
            </button>
            <button onClick={() => markAll('Absent')} className="btn btn-danger gap-2 whitespace-nowrap">
              <XCircle className="w-4 h-4" /> Mark All Absent
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Roll No</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th className="text-center min-w-[260px]">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? filteredStudents.map((s, i) => {
                  const { init, color } = getAvatar(s.name);
                  const status = attendanceMap[s.studentId] || 'Not Marked';
                  const rowBg =
                    status === 'Present' ? 'bg-emerald-50/60 dark:bg-emerald-900/10' :
                    status === 'Absent'  ? 'bg-rose-50/60 dark:bg-rose-900/10'       : '';

                  return (
                    <tr key={s.studentId} className={`transition-colors ${rowBg}`}>
                      <td className="text-slate-400 text-xs">{i + 1}</td>
                      <td><span className="badge badge-blue font-mono text-xs">{s.rollNumber}</span></td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className={`avatar w-8 h-8 text-xs bg-gradient-to-br ${color} shrink-0`}>{init}</div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-gray">{s.department}</span></td>
                      <td className="text-slate-600 dark:text-slate-400 text-sm">{s.year}{['st','nd','rd','th'][s.year-1]}</td>
                      <td>
                        <div className="flex items-center justify-center gap-3 py-1">
                          {/* Present */}
                          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border-2 transition-all duration-150 select-none text-sm font-semibold
                            ${status === 'Present'
                              ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                              : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600'
                            }`}>
                            <input
                              type="radio"
                              name={`att-${s.studentId}`}
                              value="Present"
                              checked={status === 'Present'}
                              onChange={() => handleRadio(s.studentId, 'Present')}
                              className="sr-only"
                            />
                            <CheckCircle className="w-4 h-4" />
                            Present
                          </label>

                          {/* Absent */}
                          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border-2 transition-all duration-150 select-none text-sm font-semibold
                            ${status === 'Absent'
                              ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/30'
                              : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-slate-400 hover:border-rose-400 hover:text-rose-600'
                            }`}>
                            <input
                              type="radio"
                              name={`att-${s.studentId}`}
                              value="Absent"
                              checked={status === 'Absent'}
                              onChange={() => handleRadio(s.studentId, 'Absent')}
                              className="sr-only"
                            />
                            <XCircle className="w-4 h-4" />
                            Absent
                          </label>

                          {/* Status badge */}
                          {status === 'Not Marked' && (
                            <span className="badge badge-gray text-xs">Not Marked</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No students found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-gray-800 gap-3 flex-wrap">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {markedCount} of {filteredStudents.length} marked
              {markedCount > 0 && (
                <span className="ml-2 text-emerald-600 font-medium">
                  · {presentCount}P / {absentCount}A
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <button onClick={handleReset} className="btn btn-secondary gap-2">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving || markedCount === 0}
                className="btn btn-primary gap-2"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                ) : (
                  <><Save className="w-4 h-4" />Save Attendance</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
