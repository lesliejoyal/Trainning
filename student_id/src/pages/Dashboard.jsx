import React from 'react';
import { Layout } from '../components/Layout';
import { useStudentStore } from '../data/store';
import { Users, UserCheck, UserX, BookOpen, TrendingUp, Clock, Award } from 'lucide-react';

export const Dashboard = () => {
  const { getDashboardStats, students, getAcademicMarks } = useStudentStore();
  const stats = getDashboardStats();

  const subjects = ['Assignment', 'Quiz', 'Internal'];
  const subjectColors = ['#4f6ef7', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa'];

  // Calculate subject-wise averages from academic marks
  const subjectAverages = subjects.map((subj, i) => {
    const key = subj.toLowerCase();
    let total = 0, count = 0;
    students.forEach(s => {
      const marks = getAcademicMarks(s.studentId);
      if (marks && marks[key] !== undefined && marks[key] !== '') {
        total += Number(marks[key]);
        count++;
      }
    });
    return {
      name: subj,
      avg: count > 0 ? Math.round(total / count) : 0,
      color: subjectColors[i % subjectColors.length],
    };
  });

  // Recent students (last 5)
  const recentStudents = students.slice(-5).reverse();

  // Overall performance
  const overallAvg = subjectAverages.length > 0
    ? Math.round(subjectAverages.reduce((s, a) => s + a.avg, 0) / subjectAverages.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">

        {/* Alert Banner */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] rounded-2xl px-5 py-3 shadow-sm border border-[#e2e8f0] dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <p className="text-sm text-[#475569] dark:text-slate-300">
              Welcome back! You have <span className="font-bold text-[#1e293b] dark:text-white">{stats.totalStudents} students</span> enrolled.
            </p>
          </div>
          <button className="btn btn-primary text-xs px-4 py-2">View All</button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: Users, color: '#4f6ef7', bg: '#eef2ff' },
            { label: 'Present Today', value: stats.presentToday, icon: UserCheck, color: '#22c55e', bg: '#dcfce7' },
            { label: 'Absent Today', value: stats.absentToday, icon: UserX, color: '#ef4444', bg: '#fee2e2' },
            { label: 'Avg. Performance', value: `${overallAvg}%`, icon: TrendingUp, color: '#a78bfa', bg: '#f3e8ff' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5 flex items-center gap-4 animate-slide-up">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#94a3b8]">{label}</p>
                <p className="text-2xl font-bold text-[#1e293b] dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Subject Progress */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#4f6ef7]" />
                Subject-wise Progress
              </h2>
              <span className="text-xs font-semibold text-[#4f6ef7] cursor-pointer hover:underline">See All</span>
            </div>
            <div className="space-y-5">
              {subjectAverages.map(({ name, avg, color }) => (
                <div key={name} className="flex items-center gap-4">
                  <p className="text-sm font-medium text-[#475569] dark:text-slate-300 w-28 shrink-0">{name}</p>
                  <div className="flex-1 h-3 bg-[#f1f5f9] dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${avg}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#475569] dark:text-slate-300 w-10 text-right">{avg}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Overall Progress Circle */}
          <div className="card p-6 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-[#1e293b] dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4f6ef7]" />
              Avg. Performance
            </h2>
            {/* Circular Progress */}
            <div className="relative w-36 h-36 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" className="dark:stroke-slate-700" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="#4f6ef7"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallAvg / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#1e293b] dark:text-white">{overallAvg}%</span>
                <span className="text-[11px] text-[#94a3b8]">Completed</span>
              </div>
            </div>
            <p className="text-xs text-[#94a3b8] text-center">Average across all subjects</p>
          </div>

        </div>

        {/* Bottom: Recent Students */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4f6ef7]" />
              Recent Students
            </h2>
            <span className="text-xs font-semibold text-[#4f6ef7] cursor-pointer hover:underline">See All</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentStudents.length > 0 ? recentStudents.map((s) => (
              <div key={s.studentId} className="flex items-center gap-3 p-3 bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl border border-[#e2e8f0] dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {s.name?.split(' ')[0]?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1e293b] dark:text-white truncate">{s.name}</p>
                  <p className="text-[11px] text-[#94a3b8] truncate">{s.department}</p>
                </div>
              </div>
            )) : (
              <p className="col-span-full text-center text-sm text-[#94a3b8] py-8">No students added yet</p>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
