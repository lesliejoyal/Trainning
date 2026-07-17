import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, Calendar, UserPlus,
  Clock, ArrowUpRight, Award, Flame, Heart, Gift,
  ArrowRight, Download, Sparkles, Smile, RefreshCw,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmployees } from '../hooks/useEmployees';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import toast from 'react-hot-toast';

// ─── AI-Style Insights Generator ───
const getAIInsights = (employees, activeCount, onLeaveCount) => {
  const ratio = activeCount / (employees.length || 1);
  if (ratio < 0.8) {
    return {
      status: 'warning',
      text: 'Workforce active rate is below 80%. Consider adjusting shift allocations and reviewing leave queue density.',
      action: 'Optimize Schedules'
    };
  }
  if (onLeaveCount > 2) {
    return {
      status: 'info',
      text: 'Higher volume of concurrent leaves this week. Cross-team coverage is recommended for product milestones.',
      action: 'View Leave calendar'
    };
  }
  return {
    status: 'success',
    text: 'All workforce metrics are healthy. High task delivery rates this week with zero critical contract expirations.',
    action: 'Send Team Kudos'
  };
};

const INITIAL_WIDGETS = ['stats', 'growth', 'departments', 'insights', 'engagement', 'collaboration', 'activities', 'reviews'];

const Dashboard = () => {
  const { employees } = useEmployees();
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('ems_admin_widgets');
    return saved ? JSON.parse(saved) : INITIAL_WIDGETS;
  });
  
  // Undo support for removing widgets
  const [removedWidgets, setRemovedWidgets] = useState([]);

  useEffect(() => {
    localStorage.setItem('ems_admin_widgets', JSON.stringify(widgets));
  }, [widgets]);

  const removeWidget = (name) => {
    setWidgets(prev => prev.filter(w => w !== name));
    setRemovedWidgets(prev => [...prev, name]);
    toast((t) => (
      <span className="flex items-center gap-2 text-xs">
        Widget removed
        <button 
          onClick={() => {
            setWidgets(curr => [...curr, name]);
            setRemovedWidgets(curr => curr.filter(w => w !== name));
            toast.dismiss(t.id);
          }}
          className="font-bold underline text-indigo-500 ml-2"
        >
          Undo
        </button>
      </span>
    ));
  };

  const resetWidgets = () => {
    setWidgets(INITIAL_WIDGETS);
    setRemovedWidgets([]);
    toast.success('Dashboard widgets reset to default layout');
  };

  // Move widget up or down in list
  const moveWidget = (index, direction) => {
    const nextWidgets = [...widgets];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextWidgets.length) return;
    const temp = nextWidgets[index];
    nextWidgets[index] = nextWidgets[targetIndex];
    nextWidgets[targetIndex] = temp;
    setWidgets(nextWidgets);
  };

  // Calculations
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const remoteCount = employees.filter((e) => e.status === 'Remote').length;

  const workforceHealth = totalEmployees > 0 ? Math.round((activeCount / totalEmployees) * 100) : 95;
  const avgProductivity = 91; // Dummy score calculation based on performance review data

  // Recharts calculations
  const statusData = [
    { name: 'Active', value: activeCount, color: 'var(--color-primary, #6366f1)' },
    { name: 'On Leave', value: onLeaveCount, color: '#f59e0b' },
    { name: 'Remote', value: remoteCount, color: '#10b981' },
  ];

  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(deptCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const employeeGrowthData = [
    { month: 'Jan', employees: Math.max(10, totalEmployees - 15), prediction: Math.max(10, totalEmployees - 15) },
    { month: 'Feb', employees: Math.max(10, totalEmployees - 10), prediction: Math.max(10, totalEmployees - 10) },
    { month: 'Mar', employees: Math.max(10, totalEmployees - 5), prediction: Math.max(10, totalEmployees - 5) },
    { month: 'Apr', employees: totalEmployees, prediction: totalEmployees },
    { month: 'May', prediction: totalEmployees + 3 },
    { month: 'Jun', prediction: totalEmployees + 7 },
  ];

  // AI-Insights
  const aiInsight = getAIInsights(employees, activeCount, onLeaveCount);

  // Widget Header Action Buttons
  const WidgetHeader = ({ title, name, index }) => (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
      <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" /> {title}
      </h3>
      <div className="flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
        <button onClick={() => moveWidget(index, -1)} disabled={index === 0} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs disabled:opacity-30">▲</button>
        <button onClick={() => moveWidget(index, 1)} disabled={index === widgets.length - 1} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-xs disabled:opacity-30">▼</button>
        <button onClick={() => removeWidget(name)} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 rounded text-xs" title="Hide widget">×</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Smart Dashboard"
        description="Dynamic metrics and real-time workforce health intelligence"
      >
        <div className="flex items-center gap-2">
          {removedWidgets.length > 0 && (
            <Button variant="secondary" onClick={resetWidgets} size="sm">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Restore Widgets
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => toast.success('Dashboard report generated!')}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-col gap-6">
        
        {widgets.map((widget, idx) => {
          if (widget === 'stats') {
            return (
              <motion.div key={widget} layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5 flex items-center justify-between border-l-4 border-l-primary">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Employees</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalEmployees}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-emerald-500" /> +5% vs Q1</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </Card>

                <Card className="p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Workforce Health</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{workforceHealth}%</h3>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Smile className="h-3 w-3 text-emerald-500" /> Optimal state</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </div>
                </Card>

                <Card className="p-5 flex items-center justify-between border-l-4 border-l-indigo-550">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Productivity Score</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{avgProductivity}%</h3>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Flame className="h-3 w-3 text-amber-500" /> High Activity</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-505 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-indigo-500" />
                  </div>
                </Card>

                <Card className="p-5 flex items-center justify-between border-l-4 border-l-amber-500">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">On Leave Today</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{onLeaveCount}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Overlapping logs</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                </Card>
              </motion.div>
            );
          }

          if (widget === 'insights') {
            return (
              <motion.div key={widget} layout>
                <Card className="p-5 bg-gradient-to-r from-primary-light/35 to-transparent dark:from-primary-dark/20 border border-primary/20">
                  <WidgetHeader title="AI Workforce Insights" name="insights" index={idx} />
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Recommendations</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {aiInsight.text}
                      </p>
                      <button 
                        onClick={() => toast.success(`Action initiated: ${aiInsight.action}`)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        {aiInsight.action} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          }

          if (widget === 'growth') {
            return (
              <motion.div key={widget} layout className="grid gap-5 lg:grid-cols-3">
                <Card className="lg:col-span-2 p-5">
                  <WidgetHeader title="Employee Growth & Prediction" name="growth" index={idx} />
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={employeeGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="growthCol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="employees" name="Current Staff" stroke="var(--color-primary, #6366f1)" strokeWidth={2.5} fill="url(#growthCol)" />
                      <Area type="monotone" dataKey="prediction" name="Predictive Trend" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Status breakdown circular */}
                <Card className="p-5">
                  <WidgetHeader title="Workforce Composition" name="growth" index={idx} />
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-2">
                    {statusData.map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                          <span className="text-slate-650 dark:text-slate-400">{s.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          }

          if (widget === 'departments') {
            return (
              <motion.div key={widget} layout>
                <Card className="p-5">
                  <WidgetHeader title="Headcount comparison by Department" name="departments" index={idx} />
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={departmentData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:[&>line]:stroke-slate-700" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#e2e8f050' }} />
                      <Bar dataKey="count" fill="var(--color-primary, #6366f1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            );
          }

          if (widget === 'engagement') {
            return (
              <motion.div key={widget} layout className="grid gap-5 md:grid-cols-3">
                {/* Employee of the month */}
                <Card className="p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <Award className="h-40 w-40" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-amber-100 flex items-center gap-1.5">
                      <Trophy className="h-4 w-4" /> Employee of the Month
                    </h4>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center font-extrabold text-lg text-white">
                        KK
                      </div>
                      <div>
                        <p className="font-extrabold text-base">Kavitha Kanimozhi</p>
                        <p className="text-xs text-amber-100">Senior Engineer · Engineering</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-100/90 mt-4 leading-relaxed italic">
                    "Outstanding execution of the platform UI upgrades and exemplary teamwork behavior."
                  </p>
                </Card>

                {/* Birthday reminders card */}
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Gift className="h-4 w-4 text-rose-500" /> Upcoming Birthdays
                    </h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-white">Arivoli Subramanian</span>
                        <span className="text-slate-400">July 15 (In 2 days)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-2">
                        <span className="font-semibold text-slate-800 dark:text-white">Meenakshi Nandhini</span>
                        <span className="text-slate-400">July 22</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-3" onClick={() => toast.success('Birthday greeting schedule enabled!')}>
                    View Calendar
                  </Button>
                </Card>

                {/* Welcome board for new employees */}
                <Card className="p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4 text-emerald-500" /> Welcome Aboard!
                    </h4>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-600 text-sm">
                        AS
                      </div>
                      <div>
                        <p className="font-bold text-xs">Arulozhi Senthil</p>
                        <p className="text-[10px] text-slate-400">Joined July 10 · DevOps</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full text-xs mt-3" onClick={() => toast.success('Sent Slack invite link!')}>
                    Send Welcome Note
                  </Button>
                </Card>
              </motion.div>
            );
          }

          if (widget === 'collaboration') {
            return (
              <motion.div key={widget} layout className="grid gap-5 md:grid-cols-2">
                {/* News & Announcements Feed */}
                <Card className="p-5">
                  <WidgetHeader title="Company Announcements" name="collaboration" index={idx} />
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-primary uppercase bg-primary-light px-2 py-0.5 rounded">Corporate</span>
                        <span className="text-[10px] text-slate-400">Today</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-white">Annual Town Hall Q3</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Scheduled for next Tuesday at 3:00 PM IST. Interactive polls will be open.</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-100 px-2 py-0.5 rounded">Security</span>
                        <span className="text-[10px] text-slate-400">2 days ago</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-800 dark:text-white">Mandatory SSO Upgrade</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">All corporate logins will transit to single sign-on before Friday.</p>
                    </div>
                  </div>
                </Card>

                {/* Polls & Surveys Widget */}
                <Card className="p-5 flex flex-col justify-between">
                  <WidgetHeader title="Active Quick Survey" name="collaboration" index={idx} />
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-white">Where should we host the Q3 team outing?</h5>
                    <div className="mt-3 space-y-2">
                      <button onClick={() => toast.success('Voted for Hill Station Resort')} className="w-full flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700 hover:border-primary px-3 py-2 rounded-xl text-left transition-colors">
                        <span>Resort in Ooty / Kodaikanal</span>
                        <span className="font-semibold text-slate-400">42%</span>
                      </button>
                      <button onClick={() => toast.success('Voted for Beachside Villa')} className="w-full flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700 hover:border-primary px-3 py-2 rounded-xl text-left transition-colors">
                        <span>Beach Villa in ECR Chennai</span>
                        <span className="font-semibold text-slate-400">58%</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 text-center mt-3">Votes are anonymous. Ends July 20.</p>
                </Card>
              </motion.div>
            );
          }

          return null;
        })}

      </div>
    </div>
  );
};

export default Dashboard;
