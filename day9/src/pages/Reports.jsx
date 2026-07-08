import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useStudentStore } from '../data/store';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

/* ------------------------------------------------------------------
   Reports Page
   – Shows each student’s attendance percentage (from getStudentReport)
   – Shows academic marks (Assignment, Quiz, Internal) from store
   – Allows editing marks and saving them.
------------------------------------------------------------------ */
export const Reports = () => {
  const { getStudentReport, getAcademicMarks, saveAcademicMarks } = useStudentStore();

  const [students, setStudents] = useState([]);

  // Load report + academic marks on mount
  useEffect(() => {
    const report = getStudentReport();
    const enriched = report.map((s) => {
      const academic = getAcademicMarks(s.studentId);
      return {
        ...s,
        assignment: academic.assignment || '',
        quiz: academic.quiz || '',
        internal: academic.internal || '',
      };
    });
    setStudents(enriched);
  }, [getStudentReport, getAcademicMarks]);

  const updateMark = (id, field, value) => {
    setStudents((prev) =>
      prev.map((st) => (st.studentId === id ? { ...st, [field]: value } : st))
    );
  };

  const handleSave = () => {
    students.forEach((s) => {
      saveAcademicMarks(s.studentId, {
        assignment: s.assignment,
        quiz: s.quiz,
        internal: s.internal,
      });
    });
    toast.success('Academic marks saved');
  };

  const avg = (a, q, i) => {
    const vals = [a, q, i].map((v) => parseFloat(v)).filter((v) => !isNaN(v));
    return vals.length ? (vals.reduce((m, c) => m + c, 0) / vals.length).toFixed(1) : '';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Reports</h1>
        <div className="card overflow-x-auto">
          <table className="table w-full min-w-[800px]">
            <thead>
              <tr>
                <th>#</th>
                <th className="text-left">Student</th>
                <th className="text-left">Roll No</th>
                <th className="text-center">Attendance %</th>
                <th className="text-center">Assignment</th>
                <th className="text-center">Quiz</th>
                <th className="text-center">Internal</th>
                <th className="text-center">Avg</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.studentId} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="avatar w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                      {s.name?.split(' ')[0][0]}
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{s.name}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">{s.rollNumber}</td>
                  <td className="px-4 py-2 text-center">
                    {s.attendancePercentage !== null ? `${s.attendancePercentage}%` : '—'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.assignment}
                      onChange={(e) => updateMark(s.studentId, 'assignment', e.target.value)}
                      className="input w-16 text-center"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.quiz}
                      onChange={(e) => updateMark(s.studentId, 'quiz', e.target.value)}
                      className="input w-16 text-center"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.internal}
                      onChange={(e) => updateMark(s.studentId, 'internal', e.target.value)}
                      className="input w-16 text-center"
                    />
                  </td>
                  <td className="px-4 py-2 text-center font-medium text-slate-800 dark:text-white">
                    {avg(s.assignment, s.quiz, s.internal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary flex items-center gap-2 px-6 py-2">
            <Save className="w-4 h-4" />
            Save Marks
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
