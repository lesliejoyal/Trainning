import React, { useMemo } from 'react';
import { Layout } from '../components/Layout';
import StatCard from '../components/StatCard';
import { useStudentStore } from '../data/store';
import { useAuth } from '../hooks/useAuth';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Users, CheckCircle, XCircle, TrendingUp, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const DEPT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-xl text-xs border border-slate-100 dark:border-gray-700">
      <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { students, getDashboardStats } = useStudentStore();
  const stats = getDashboardStats();

  const deptData = useMemo(() => {
    const map = {};
    students.forEach((s) => { map[s.department] = (map[s.department] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  const trendData = stats.dailyTrend.map((d) => ({
    ...d,
    date: d.date ? format(new Date(d.date + 'T00:00:00'), 'MMM d') : d.date,
  }));

  return (
    <Layout>
      <div className="space-y-7 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {format(new Date(), 'EEEE, MMMM do yyyy')} · Here's your attendance overview.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="indigo"
            trendLabel="Enrolled this semester"
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={CheckCircle}
            color="emerald"
            trendLabel={`${stats.markedToday} marked so far`}
          />
          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            icon={XCircle}
            color="rose"
            trendLabel={`${stats.notMarked} not yet marked`}
          />
          <StatCard
            title="Attendance Rate"
            value={stats.attendancePercentage}
            icon={TrendingUp}
            color="violet"
            suffix="%"
            trendLabel="Today's average"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 7-Day Trend */}
          <div className="card p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">7-Day Attendance Trend</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Present vs Absent per day</p>
              </div>
              <span className="badge badge-blue">Last 7 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:opacity-10" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
                <Line type="monotone" dataKey="absent"  stroke="#f43f5e" name="Absent"  strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Pie */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Students by Department</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across departments</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                    <span className="font-medium text-slate-600 dark:text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Today's Attendance Bar */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-5">Today's Attendance Summary</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[{ name: 'Today', Present: stats.presentToday, Absent: stats.absentToday, 'Not Marked': stats.notMarked }]}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:opacity-10" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="Present"    fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="Absent"     fill="#f43f5e" radius={[4,4,0,0]} />
                <Bar dataKey="Not Marked" fill="#94a3b8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Info */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-5">Quick Overview</h2>
            <div className="space-y-4">
              {[
                { label: 'Total Students',      value: stats.totalStudents, icon: Users,        color: 'text-indigo-500' },
                { label: 'Attendance Today',     value: `${stats.markedToday} / ${stats.totalStudents}`, icon: Clock, color: 'text-amber-500' },
                { label: 'Attendance Rate',      value: `${stats.attendancePercentage}%`, icon: TrendingUp, color: 'text-emerald-500' },
                { label: 'Departments',          value: deptData.length, icon: BookOpen, color: 'text-violet-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50">
                  <div className={`w-9 h-9 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
