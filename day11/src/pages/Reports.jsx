import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Download, FileText, FileSpreadsheet, TrendingUp, Users,
  DollarSign, CalendarCheck, BarChart2, PieChartIcon,
  Activity, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const headcountTrend = [
  { month: 'Jan', total: 200, hired: 15, resigned: 5 },
  { month: 'Feb', total: 210, hired: 18, resigned: 8 },
  { month: 'Mar', total: 220, hired: 22, resigned: 12 },
  { month: 'Apr', total: 230, hired: 20, resigned: 10 },
  { month: 'May', total: 238, hired: 14, resigned: 6  },
  { month: 'Jun', total: 241, hired: 10, resigned: 7  },
  { month: 'Jul', total: 248, hired: 12, resigned: 5  },
];

const deptHeadcount = [
  { dept: 'Engineering', count: 82, color: '#6366f1' },
  { dept: 'Sales',       count: 54, color: '#8b5cf6' },
  { dept: 'Design',      count: 31, color: '#a78bfa' },
  { dept: 'HR',          count: 22, color: '#10b981' },
  { dept: 'Marketing',   count: 38, color: '#f59e0b' },
  { dept: 'Finance',     count: 21, color: '#ef4444' },
];

const attendanceWeekly = [
  { day: 'Mon', present: 230, absent: 12, late: 6  },
  { day: 'Tue', present: 228, absent: 14, late: 6  },
  { day: 'Wed', present: 235, absent: 8,  late: 5  },
  { day: 'Thu', present: 220, absent: 20, late: 8  },
  { day: 'Fri', present: 210, absent: 28, late: 10 },
];

const attendanceMonthly = [
  { month: 'Jan', rate: 94.2 }, { month: 'Feb', rate: 95.1 },
  { month: 'Mar', rate: 93.8 }, { month: 'Apr', rate: 96.0 },
  { month: 'May', rate: 94.5 }, { month: 'Jun', rate: 97.2 },
  { month: 'Jul', rate: 95.8 },
];

const leaveByType = [
  { name: 'Annual Leave',    value: 120, color: '#6366f1' },
  { name: 'Sick Leave',      value: 85,  color: '#10b981' },
  { name: 'Casual Leave',    value: 60,  color: '#f59e0b' },
  { name: 'Maternity/Paternity', value: 30, color: '#ec4899' },
  { name: 'Unpaid Leave',    value: 15,  color: '#94a3b8' },
];

const leaveTrend = [
  { month: 'Jan', approved: 28, pending: 5, rejected: 3 },
  { month: 'Feb', approved: 32, pending: 8, rejected: 2 },
  { month: 'Mar', approved: 25, pending: 6, rejected: 4 },
  { month: 'Apr', approved: 30, pending: 4, rejected: 1 },
  { month: 'May', approved: 22, pending: 3, rejected: 2 },
  { month: 'Jun', approved: 35, pending: 7, rejected: 3 },
  { month: 'Jul', approved: 18, pending: 5, rejected: 1 },
];

const payrollMonthly = [
  { month: 'Jan', gross: 2100000, deductions: 420000, net: 1680000 },
  { month: 'Feb', gross: 2150000, deductions: 430000, net: 1720000 },
  { month: 'Mar', gross: 2200000, deductions: 440000, net: 1760000 },
  { month: 'Apr', gross: 2250000, deductions: 450000, net: 1800000 },
  { month: 'May', gross: 2300000, deductions: 460000, net: 1840000 },
  { month: 'Jun', gross: 2350000, deductions: 470000, net: 1880000 },
  { month: 'Jul', gross: 2400000, deductions: 480000, net: 1920000 },
];

const deptSalary = [
  { dept: 'Engineering', avg: 92000 },
  { dept: 'Product',     avg: 105000 },
  { dept: 'Design',      avg: 80000 },
  { dept: 'Finance',     avg: 88000 },
  { dept: 'HR',          avg: 72000 },
  { dept: 'Marketing',   avg: 70000 },
];

const performanceRadar = [
  { metric: 'Productivity', score: 85 },
  { metric: 'Quality',      score: 78 },
  { metric: 'Teamwork',     score: 90 },
  { metric: 'Punctuality',  score: 88 },
  { metric: 'Innovation',   score: 72 },
  { metric: 'Leadership',   score: 68 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtK = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800 text-xs min-w-[120px]">
      <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}</span>
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{typeof p.value === 'number' && p.value > 10000 ? fmtK(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, delta, deltaUp, color }) => (
  <Card className={`relative overflow-hidden p-5 shadow-sm border-none ${color}`}>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="mt-1 text-2xl font-extrabold">{value}</p>
        <p className={`mt-1 flex items-center gap-0.5 text-xs font-semibold ${deltaUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
          <TrendingUp className={`h-3 w-3 ${!deltaUp && 'rotate-180'}`} />
          {delta} vs last period
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 dark:bg-black/20">
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="pointer-events-none absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/20" />
  </Card>
);

const ChartCard = ({ title, subtitle, children, exports = true, className = '' }) => {
  const [exporting, setExporting] = useState(null);

  const handleExport = (type) => {
    setExporting(type);
    setTimeout(() => setExporting(null), 1200);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {exports && (
          <div className="flex items-center gap-1.5">
            {[
              { type: 'PDF', icon: FileText,        cls: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'   },
              { type: 'CSV', icon: FileSpreadsheet,  cls: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' },
              { type: 'XLS', icon: Download,         cls: 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'   },
            ].map(({ type, icon: Icon, cls }) => (
              <Button key={type} variant="ghost" size="sm" onClick={() => handleExport(type)} className={`px-2 text-xs ${cls}`}>
                {exporting === type ? <CheckCircle2 className="mr-1 h-3.5 w-3.5 animate-bounce" /> : <Icon className="mr-1 h-3.5 w-3.5" />}
                {exporting === type ? 'Saved!' : type}
              </Button>
            ))}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
};

const ReportRow = ({ title, description, icon: Icon, color, badge }) => {
  const [downloading, setDownloading] = useState(false);
  const onClick = () => { setDownloading(true); setTimeout(() => setDownloading(false), 1500); };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          {badge && <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">{badge}</span>}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{description}</p>
      </div>
      <Button variant="primary" size="sm" onClick={onClick} disabled={downloading} className="px-3">
        {downloading ? <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
        {downloading ? 'Preparing…' : 'Export'}
      </Button>
    </div>
  );
};

// ─── Tab Content Sections ─────────────────────────────────────────────────────
const EmployeeReports = () => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard icon={Users}        label="Total Employees"    value="248"    delta="+12%" deltaUp={true}  color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
      <SummaryCard icon={TrendingUp}   label="New Hires (Jul)"    value="12"     delta="+2"   deltaUp={true}  color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
      <SummaryCard icon={Activity}     label="Resignations (Jul)" value="5"      delta="-3"   deltaUp={true}  color="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300" />
      <SummaryCard icon={BarChart2}    label="Avg Tenure"         value="2.4 yr" delta="+0.2" deltaUp={true}  color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
    </div>

    <div className="grid gap-5 lg:grid-cols-3">
      <ChartCard title="Headcount Trend" subtitle="New hires vs resignations (YTD)" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={headcountTrend} margin={{ top:5, right:10, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}  />
              </linearGradient>
              <linearGradient id="gHired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}  />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', paddingTop:'10px' }} />
            <Area type="monotone" dataKey="total"   name="Total"    stroke="#6366f1" strokeWidth={2.5} fill="url(#gTotal)" dot={false} activeDot={{ r:5 }} />
            <Area type="monotone" dataKey="hired"   name="Hired"    stroke="#10b981" strokeWidth={2}   fill="url(#gHired)" dot={false} />
            <Area type="monotone" dataKey="resigned"name="Resigned" stroke="#f43f5e" strokeWidth={2}   fill="none"         dot={false} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Headcount by Dept" subtitle="Current distribution">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={deptHeadcount} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count" nameKey="dept">
              {deptHeadcount.map((d) => <Cell key={d.dept} fill={d.color} stroke="transparent" />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {deptHeadcount.map((d) => (
            <div key={d.dept} className="flex items-center gap-1.5 text-xs">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-slate-600 dark:text-slate-400 truncate">{d.dept}</span>
              <span className="ml-auto font-semibold text-slate-900 dark:text-white">{d.count}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  </div>
);

const AttendanceReports = () => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard icon={CalendarCheck} label="Avg Daily Presence"  value="94.6%"  delta="+1.2%" deltaUp={true}  color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
      <SummaryCard icon={Users}         label="Avg Absent/Day"      value="11"     delta="-3"    deltaUp={true}  color="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300" />
      <SummaryCard icon={Activity}      label="Late Arrivals"        value="6.4/day" delta="-0.8" deltaUp={true}  color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
      <SummaryCard icon={TrendingUp}    label="Best Month"           value="Jun 97%" delta="All time" deltaUp={true} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard title="This Week's Attendance" subtitle="Present · Absent · Late breakdown">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={attendanceWeekly} margin={{ top:5, right:10, left:-20, bottom:0 }} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="day" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'#6366f108' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', paddingTop:'10px' }} />
            <Bar dataKey="present" name="Present" fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="absent"  name="Absent"  fill="#f43f5e" radius={[4,4,0,0]} />
            <Bar dataKey="late"    name="Late"    fill="#f59e0b" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Attendance Rate %" subtitle="YTD trend line">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={attendanceMonthly} margin={{ top:5, right:10, left:-20, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[88, 100]} tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="rate" name="Rate %" stroke="#6366f1" strokeWidth={2.5} dot={{ fill:'#6366f1', r:4 }} activeDot={{ r:6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

const LeaveReports = () => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard icon={CalendarCheck} label="Total Leaves (YTD)"  value="310"   delta="+18%"  deltaUp={false} color="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300" />
      <SummaryCard icon={CheckCircle2}  label="Approved"            value="240"   delta="+22"   deltaUp={true}  color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
      <SummaryCard icon={Activity}      label="Pending Review"      value="38"    delta="+5"    deltaUp={false} color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
      <SummaryCard icon={TrendingUp}    label="Avg Days per Leave"  value="2.8"   delta="-0.3"  deltaUp={true}  color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
    </div>

    <div className="grid gap-5 lg:grid-cols-3">
      <ChartCard title="Leave Type Breakdown" subtitle="Distribution by category" className="">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={leaveByType} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
              {leaveByType.map((d) => <Cell key={d.name} fill={d.color} stroke="transparent" />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1.5">
          {leaveByType.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{d.value}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Monthly Leave Requests" subtitle="Approved · Pending · Rejected" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={leaveTrend} margin={{ top:5, right:10, left:-20, bottom:0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'#6366f108' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', paddingTop:'10px' }} />
            <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="pending"  name="Pending"  fill="#f59e0b" radius={[4,4,0,0]} />
            <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

const PayrollReports = () => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard icon={DollarSign}  label="Total Payroll (Jul)"  value="₹19.2L" delta="+2.1%"  deltaUp={true}  color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
      <SummaryCard icon={TrendingUp}  label="Avg Net Salary"       value="₹77,742" delta="+₹3,200"  deltaUp={true}  color="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300" />
      <SummaryCard icon={BarChart2}   label="Total Deductions"      value="₹4.8L"  delta="+2.1%"  deltaUp={false} color="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300" />
      <SummaryCard icon={Activity}    label="YTD Payroll"          value="₹1.25C" delta="+8.4%"  deltaUp={true}  color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard title="Monthly Payroll (YTD)" subtitle="Gross, Deductions & Net Pay">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={payrollMonthly} margin={{ top:5, right:10, left:-10, bottom:0 }}>
            <defs>
              <linearGradient id="gGross" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => fmtK(v)} tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', paddingTop:'10px' }} />
            <Area type="monotone" dataKey="gross"      name="Gross"      stroke="#6366f1" strokeWidth={2}   fill="url(#gGross)" dot={false} />
            <Area type="monotone" dataKey="net"        name="Net"        stroke="#10b981" strokeWidth={2.5} fill="url(#gNet)"   dot={false} />
            <Area type="monotone" dataKey="deductions" name="Deductions" stroke="#f43f5e" strokeWidth={1.5} fill="none"         dot={false} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Avg Salary by Department" subtitle="Annual basic salary comparison">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={deptSalary} layout="vertical" margin={{ top:5, right:15, left:0, bottom:0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} className="dark:[&>line]:stroke-slate-700" />
            <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="dept" width={70} tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'#6366f108' }} />
            <Bar dataKey="avg" name="Avg Salary" radius={[0,6,6,0]}>
              {deptSalary.map((_, i) => (
                <Cell key={i} fill={['#6366f1','#8b5cf6','#10b981','#f59e0b','#ec4899','#14b8a6'][i % 6]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>

    <ChartCard title="Performance Overview" subtitle="Organization-wide average across key metrics">
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={performanceRadar} margin={{ top:10, right:40, left:40, bottom:10 }}>
            <PolarGrid stroke="#e2e8f0" className="dark:[&>line]:stroke-slate-700" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize:11, fill:'#94a3b8' }} />
            <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize:9, fill:'#94a3b8' }} />
            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  </div>
);

// ─── Scheduled Reports Catalog ────────────────────────────────────────────────
const ScheduledReports = () => {
  const reports = [
    { title: 'Employee Master Report',      description: 'Full list with contact, department, salary, and status details',            icon: Users,         color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300', badge: 'Monthly' },
    { title: 'Monthly Attendance Summary',  description: 'Present/Absent/Late counts per employee for the selected month',            icon: CalendarCheck, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300', badge: 'Auto' },
    { title: 'Leave Utilization Report',    description: 'Leave balances, approved days, and remaining quota per employee',          icon: Activity,      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300', badge: 'Quarterly' },
    { title: 'Payroll Summary Report',      description: 'Gross, deductions, and net pay per employee with department totals',        icon: DollarSign,    color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300', badge: 'Monthly' },
    { title: 'New Hire Report',             description: 'Employees joined in the selected period with onboarding status',            icon: TrendingUp,    color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300', badge: null },
    { title: 'Department Cost Analysis',    description: 'Total payroll cost broken down by department with trend comparison',       icon: BarChart2,     color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300', badge: 'Quarterly' },
    { title: 'Performance Review Summary',  description: 'Aggregated performance scores and review completion status',               icon: PieChartIcon,  color: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-300', badge: 'Annual' },
  ];
  return (
    <div className="space-y-3">
      {reports.map((r) => <ReportRow key={r.title} {...r} />)}
    </div>
  );
};

// ─── Reports Page ─────────────────────────────────────────────────────────────
const TABS = [
  { key: 'employee',   label: 'Employee',   icon: Users         },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { key: 'leave',      label: 'Leave',      icon: Activity      },
  { key: 'payroll',    label: 'Payroll',    icon: DollarSign    },
  { key: 'scheduled',  label: 'All Reports',icon: FileText      },
];

const YEAR_OPTIONS = ['2026', '2025', '2024'];
const PERIOD_OPTIONS = ['Last 7 days', 'This month', 'Last 3 months', 'YTD', 'Last year'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('employee');
  const [period,    setPeriod]    = useState('YTD');
  const [year,      setYear]      = useState('2026');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <PageHeader 
        title="Reports & Analytics" 
        description="Data-driven insights across your entire workforce"
      >
        <div className="flex items-center gap-2">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-auto py-2 px-3 text-sm font-medium pr-8">
            {PERIOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Select value={year} onChange={(e) => setYear(e.target.value)} className="w-auto py-2 px-3 text-sm font-medium pr-8">
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </PageHeader>

      {/* ── Tabs ── */}
      <div className="flex overflow-x-auto gap-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex flex-1 min-w-max items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}>
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Period display badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          <Activity className="h-3 w-3" /> Showing: {period} · {year}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500">Data auto-refreshed</span>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'employee'   && <EmployeeReports />}
      {activeTab === 'attendance' && <AttendanceReports />}
      {activeTab === 'leave'      && <LeaveReports />}
      {activeTab === 'payroll'    && <PayrollReports />}
      {activeTab === 'scheduled'  && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Available Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Download pre-configured reports as PDF, CSV, or Excel</p>
            <ScheduledReports />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
