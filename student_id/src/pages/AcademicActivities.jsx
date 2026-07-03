import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useStudentStore } from '../data/store';
import toast from 'react-hot-toast';
import { Users, Edit2, Save } from 'lucide-react';

/* ------------------------------------------------------------------
   Academic Activities Page
   – Lists all students
   – Allows teachers to input Assignment / Quiz / Internal marks
   – Saves marks to local storage via the store’s saveAcademicMarks()
------------------------------------------------------------------- */
export const AcademicActivities = () => {
  const {
    students,
    getAcademicMarks,
    saveAcademicMarks,
  } = useStudentStore();

  // { [studentId]: { assignment: '', quiz: '', internal: '' } }
  const [marksMap, setMarksMap] = useState({});

  // Load existing marks (or empty) for each student on mount
  useEffect(() => {
    const init = {};
    students.forEach((s) => {
      init[s.studentId] = getAcademicMarks(s.studentId);
    });
    setMarksMap(init);
  }, [students, getAcademicMarks]);

  const setStudentMark = (id, field, value) => {
    setMarksMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = () => {
    // Validate: all fields should be numbers between 0-100 (or empty)
    for (const [id, m] of Object.entries(marksMap)) {
      for (const key of ['assignment', 'quiz', 'internal']) {
        const v = m[key];
        if (v !== '' && (isNaN(v) || v < 0 || v > 100)) {
          toast.error(
            `Invalid ${key} mark for student #${id}. Use 0-100 or leave empty.`
          );
          return;
        }
      }
      // Persist each student's marks
      saveAcademicMarks(Number(id), {
        assignment: m.assignment,
        quiz: m.quiz,
        internal: m.internal,
      });
    }
    toast.success('All academic marks saved.');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in p-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Academic Activities
        </h1>

        {/* Table of students with mark inputs */}
        <div className="card overflow-hidden">
          <div className="table-wrapper overflow-x-auto">
            <table className="table w-full min-w-[800px]">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-left">Student</th>
                  <th className="text-left">Roll No</th>
                  <th className="text-center">Assignment</th>
                  <th className="text-center">Quiz</th>
                  <th className="text-center">Internal</th>
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

                    {/* Assignment mark */}
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksMap[s.studentId]?.assignment ?? ''}
                        onChange={(e) =>
                          setStudentMark(s.studentId, 'assignment', e.target.value)
                        }
                        className="input w-20 text-center"
                        placeholder="-"
                      />
                    </td>

                    {/* Quiz mark */}
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksMap[s.studentId]?.quiz ?? ''}
                        onChange={(e) => setStudentMark(s.studentId, 'quiz', e.target.value)}
                        className="input w-20 text-center"
                        placeholder="-"
                      />
                    </td>

                    {/* Internal mark */}
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksMap[s.studentId]?.internal ?? ''}
                        onChange={(e) =>
                          setStudentMark(s.studentId, 'internal', e.target.value)
                        }
                        className="input w-20 text-center"
                        placeholder="-"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            <Save className="w-4 h-4" />
            Save Marks
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AcademicActivities;
