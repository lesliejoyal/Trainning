import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Users, Briefcase, TrendingUp, Calendar, UserPlus, FileText,
  Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, ChevronRight,
} from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const employeeGrowthData = [
  { month: 'Jan', employees: 200, hired: 15, resigned: 5 },
  { month: 'Feb', employees: 210, hired: 18, resigned: 8 },
  { month: 'Mar', employees: 220, hired: 22, resigned: 12 },
  { month: 'Apr', employees: 230, hired: 20, resigned: 10 },
  { month: 'May', employees: 238, hired: 14, resigned: 6 },
  { month: 'Jun', employees: 241, hired: 10, resigned: 7 },
  { month: 'Jul', employees: 248, hired: 12, resigned: 5 },
];

// departmentData is calculated dynamically

// statusData is calculated dynamically

const recentActivities = [
  { id: 1, type: 'hired',    user: 'Sarah Connor',  role: 'Senior Engineer',   time: '2 hours ago',  icon: UserPlus,    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  { id: 2, type: 'review',   user: 'Mark Chen',     role: 'Performance Review', time: '4 hours ago',  icon: FileText,    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' },
  { id: 3, type: 'leave',    user: 'Priya Mehta',   role: 'Leave Approved',    time: '6 hours ago',  icon: Calendar,    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  { id: 4, type: 'alert',    user: 'Jake Wilson',   role: 'Contract Expiring', time: '1 day ago',    icon: AlertCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30' },
  { id: 5, type: 'complete', user: 'Luna Park',     role: 'Onboarding Done',   time: '1 day ago',    icon: CheckCircle2,color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  { id: 6, type: 'hired',    user: 'Tom Richards',  role: 'UX Designer',       time: '2 days ago',   icon: UserPlus,    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
];

const quickActions = [
  { label: 'Add Employee',    icon: UserPlus,   color: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30',  href: '/app/employees' },
  { label: 'Post Job',        icon: Briefcase,  color: 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/30',  href: '#' },
  { label: 'Generate Report', icon: FileText,   color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30', href: '#' },
  { label: 'Schedule Review', icon: Clock,      color: 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30',     href: '#' },
];

const upcomingReviews = [
  { name: 'Alex Turner',  role: 'Backend Engineer', date: 'Jul 10', avatar: 'AT' },
  { name: 'Mia Rodriguez',role: 'Product Manager',  date: 'Jul 12', avatar: 'MR' },
  { name: 'Sam Kim',      role: 'Data Analyst',     date: 'Jul 15', avatar: 'SK' },
  { name: 'Chris Patel',  role: 'DevOps Lead',      date: 'Jul 18', avatar: 'CP' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, trend, trendUp, sub }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1.5">
      {trendUp
        ? <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        : <ArrowDownRight className="h-4 w-4 text-rose-500" />
      }
      <span className={`text-sm font-semibold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {trend}
      </span>
      <span className="text-sm text-slate-400 dark:text-slate-500">vs last month</span>
    </div>
    {/* Decorative */}
    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-50 opacity-60 dark:bg-indigo-900/20" />
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
    {action && (
      <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
        {action} <ChevronRight className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 text-xs">
      <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const { employees } = useEmployees();

  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const remoteCount = employees.filter((e) => e.status === 'Remote').length;

  const statusData = [
    { name: 'Active', value: activeCount, color: '#6366f1' },
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

  const stats = [
    { title: 'Total Employees', value: totalEmployees.toString(),  icon: Users,      trend: '+12%',  trendUp: true,  sub: '20 new this quarter' },
    { title: 'Open Positions',  value: '14',   icon: Briefcase,  trend: '+2',    trendUp: true,  sub: '5 interviewing now' },
    { title: 'Avg Performance', value: '92%',  icon: TrendingUp, trend: '+4%',   trendUp: true,  sub: 'Based on Q2 reviews' },
    { title: 'On Leave Today',  value: onLeaveCount.toString(),    icon: Calendar,   trend: '-2',    trendUp: false, sub: '3 return tomorrow' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <PageHeader
        title="Dashboard"
        description={new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
      >
        <Button variant="secondary">
          <MoreHorizontal className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map(({ label, icon: Icon, color, href }) => (
            <a
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5 text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl ${color}`}
            >
              <Icon className="h-7 w-7" />
              <span className="text-xs font-semibold text-center leading-tight">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Charts Row 1: Area + Pie ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Employee Growth Area Chart */}
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Employee Growth" action="View details" />
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={employeeGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="employees" name="Total" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorEmp)" dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="hired"     name="Hired"  stroke="#10b981" strokeWidth={2} fill="url(#colorHired)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Pie Chart */}
        <Card className="p-6">
          <SectionHeader title="Employee Status" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Charts Row 2: Bar Chart ── */}
      <Card className="p-6">
        <SectionHeader title="Headcount by Department" action="Full report" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={departmentData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f110' }} />
            <Bar dataKey="count" name="Employees" fill="#6366f1" radius={[6, 6, 0, 0]}>
              {departmentData.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? '#6366f1' : '#818cf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Bottom Row: Activity + Reviews ── */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Recent Activities */}
        <Card className="p-6">
          <SectionHeader title="Recent Activities" action="View all" />
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{activity.user}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.role}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Reviews */}
        <Card className="p-6">
          <SectionHeader title="Upcoming Reviews" action="View schedule" />
          <div className="space-y-3">
            {upcomingReviews.map((r) => (
              <div key={r.name} className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{r.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.role}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    {r.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
