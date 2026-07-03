import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useStudentStore } from '../data/store';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const Attendance = () => {
  const { students, getAttendance, saveAttendance } = useStudentStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [attendanceMap, setAttendanceMap] = useState({});

  // Initialize attendance for today
  useEffect(() => {
    const existing = getAttendance(today) || {};
    const init = {};
    students.forEach((s) => {
      init[s.studentId] = existing[s.studentId] || '';
    });
    setAttendanceMap(init);
  }, [students, getAttendance, today]);

  const handleChange = (id, status) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    // Remove entries with no selection
    const toSave = {};
    Object.entries(attendanceMap).forEach(([id, status]) => {
      if (status) toSave[id] = status;
    });
    saveAttendance(today, toSave);
    toast.success('Attendance saved for today');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in p-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Attendance for {format(new Date(), 'PPP')}
        </h1>
        <div className="overflow-auto rounded-lg shadow">
          <table className="min-w-full table-auto bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Student</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Roll No</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">Present</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <div className="avatar w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs">
                      {s.name?.split(' ')[0][0]}
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">{s.name}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">{s.rollNumber}</td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`att-${s.studentId}`}
                      value="Present"
                      checked={attendanceMap[s.studentId] === 'Present'}
                      onChange={() => handleChange(s.studentId, 'Present')}
                      className="form-radio h-4 w-4 text-green-600"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="radio"
                      name={`att-${s.studentId}`}
                      value="Absent"
                      checked={attendanceMap[s.studentId] === 'Absent'}
                      onChange={() => handleChange(s.studentId, 'Absent')}
                      className="form-radio h-4 w-4 text-red-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="btn btn-primary px-6 py-2"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
