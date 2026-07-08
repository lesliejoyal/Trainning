import { useState, useCallback } from 'react';
import { mockStudents } from './mockStudents';
import { format, subDays } from 'date-fns';

// ── Keys ──────────────────────────────────────────────
const STUDENTS_KEY = 'sms_students';
const ATTENDANCE_KEY = 'sms_attendance';
const ACADEMIC_KEY = 'sms_academic';

// ── Initialise localStorage once ─────────────────────
const initStudents = () => {
  const saved = localStorage.getItem(STUDENTS_KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(mockStudents));
  return mockStudents;
};

const initAttendance = () => {
  const saved = localStorage.getItem(ATTENDANCE_KEY);
  if (saved) return JSON.parse(saved);

  // Seed 7 days of past attendance
  const students = initStudents();
  const statuses = ['Present', 'Present', 'Present', 'Absent', 'Present'];
  const seed = {};
  for (let d = 6; d >= 1; d--) {
    const date = format(subDays(new Date(), d), 'yyyy-MM-dd');
    seed[date] = {};
    students.forEach((s) => {
      seed[date][s.studentId] = statuses[Math.floor(Math.random() * statuses.length)];
    });
  }
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(seed));
  return seed;
};

const initAcademic = () => {
  const saved = localStorage.getItem(ACADEMIC_KEY);
  if (saved) return JSON.parse(saved);
  const empty = {};
  localStorage.setItem(ACADEMIC_KEY, JSON.stringify(empty));
  return empty;
};

// ── Hook ──────────────────────────────────────────────
export const useStudentStore = () => {
  const [students, setStudents] = useState(() => initStudents());
  const [attendance, setAttendance] = useState(() => initAttendance());
  const [academic, setAcademic] = useState(() => initAcademic());

  // ── Student CRUD ──────────────────────────────────
  const addStudent = useCallback((data) => {
    setStudents((prev) => {
      const maxId = prev.reduce((m, s) => Math.max(m, s.studentId), 0);
      const next = [
        ...prev,
        {
          ...data,
          studentId: maxId + 1,
          isActive: true,
          createdAt: format(new Date(), 'yyyy-MM-dd'),
        },
      ];
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateStudent = useCallback((id, data) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.studentId === id ? { ...s, ...data } : s));
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.studentId !== id);
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Attendance ────────────────────────────────────
  const getAttendance = useCallback(
    (date) => attendance[date] || {},
    [attendance]
  );

  const saveAttendance = useCallback((date, data) => {
    setAttendance((prev) => {
      const next = { ...prev, [date]: data };
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Academic Marks ─────────────────────────────────
  const getAcademicMarks = useCallback(
    (studentId) => academic[studentId] || { assignment: '', quiz: '', internal: '' },
    [academic]
  );

  const saveAcademicMarks = useCallback((studentId, data) => {
    setAcademic((prev) => {
      const next = { ...prev, [studentId]: data };
      localStorage.setItem(ACADEMIC_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Stats helpers ─────────────────────────────────
  const getDashboardStats = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayAtt = attendance[today] || {};
    const presentToday = Object.values(todayAtt).filter((v) => v === 'Present').length;
    const absentToday = Object.values(todayAtt).filter((v) => v === 'Absent').length;
    const markedToday = presentToday + absentToday;
    const total = students.length;
    const pct = total > 0 ? Math.round((presentToday / total) * 100) : 0;

    // 7-day trend
    const trend = [];
    for (let d = 6; d >= 0; d--) {
      const date = format(subDays(new Date(), d), 'yyyy-MM-dd');
      const att = attendance[date] || {};
      const present = Object.values(att).filter((v) => v === 'Present').length;
      const absent = Object.values(att).filter((v) => v === 'Absent').length;
      trend.push({ date, present, absent });
    }

    return {
      totalStudents: total,
      presentToday,
      absentToday,
      markedToday,
      notMarked: total - markedToday,
      attendancePercentage: pct,
      dailyTrend: trend,
    };
  }, [students, attendance]);

  const getStudentReport = useCallback(() => {
    const allDates = Object.keys(attendance);
    return students.map((s) => {
      let present = 0;
      let absent = 0;
      let total = 0;
      allDates.forEach((date) => {
        const status = attendance[date]?.[s.studentId];
        if (status === 'Present') { present++; total++; }
        else if (status === 'Absent') { absent++; total++; }
      });
      const pct = total > 0 ? Math.round((present / total) * 100) : null;
      return { ...s, presentDays: present, absentDays: absent, totalDays: total, attendancePercentage: pct };
    });
  }, [students, attendance]);

  return {
    students,
    attendance,
    academic,
    addStudent,
    updateStudent,
    deleteStudent,
    getAttendance,
    saveAttendance,
    getAcademicMarks,
    saveAcademicMarks,
    getDashboardStats,
    getStudentReport,
  };
};
