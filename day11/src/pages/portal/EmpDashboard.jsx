import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, CalendarClock, DollarSign, CheckSquare,
  TrendingUp, Clock, Award, AlertCircle,
  Trophy, Gift, Star, Send, Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useNotifications } from '../../hooks/useNotifications';
import { useHolidays } from '../../hooks/useHolidays';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

const INITIAL_WIDGETS = ['welcome', 'actions', 'stats', 'engagement', 'productivity', 'kudos', 'bottomRow'];

const EmpDashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks(user?.id);
  const { notifications, unreadCount } = useNotifications();
  const { upcoming: upcomingHolidays } = useHolidays();

  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('ems_emp_widgets');
    return saved ? JSON.parse(saved) : INITIAL_WIDGETS;
  });

  const [kudosText, setKudosText] = useState('');
  const [kudosRecipient, setKudosRecipient] = useState('');
  const [kudosList, setKudosList] = useState(() => {
    const saved = localStorage.getItem('ems_kudos_wall');
    return saved ? JSON.parse(saved) : [
      { id: 1, from: 'Arivoli Subramanian', to: 'Kavitha Kanimozhi', text: 'Thanks for unblocking the dashboard deployment! You are a life saver.', hearts: 5 },
      { id: 2, from: 'Meenakshi Nandhini', to: 'Elango Murugan', text: 'Awesome work on coordinating the training program templates.', hearts: 3 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ems_emp_widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('ems_kudos_wall', JSON.stringify(kudosList));
  }, [kudosList]);

  const handlePostKudos = (e) => {
    e.preventDefault();
    if (!kudosRecipient.trim() || !kudosText.trim()) return;
    const newKudos = {
      id: Date.now(),
      from: user?.name || 'Kavitha Kanimozhi',
      to: kudosRecipient,
      text: kudosText,
      hearts: 0
    };
    setKudosList(prev => [newKudos, ...prev]);
    setKudosRecipient('');
    setKudosText('');
    toast.success('Appreciation Kudos posted successfully! 🎉');
  };

  const handleLikeKudos = (id) => {
    setKudosList(prev => prev.map(k => k.id === id ? { ...k, hearts: k.hearts + 1 } : k));
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const recentNotifications = notifications.slice(0, 3);
  const nextHolidays = upcomingHolidays.slice(0, 3);
  const firstName = user?.name?.split(' ')[0] ?? 'Employee';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const QUICK_LINKS = [
    { label: 'Mark Attendance',  icon: CalendarCheck, href: '/portal/attendance', color: 'from-indigo-500 to-indigo-600',  shadow: 'shadow-indigo-500/30' },
    { label: 'Apply for Leave',  icon: CalendarClock, href: '/portal/leaves',    color: 'from-amber-500 to-orange-500',   shadow: 'shadow-amber-500/30' },
    { label: 'View Payslip',     icon: DollarSign,    href: '/portal/payroll',   color: 'from-emerald-500 to-teal-500',   shadow: 'shadow-emerald-500/30' },
    { label: 'My Tasks',         icon: CheckSquare,   href: '/portal/tasks',     color: 'from-violet-500 to-purple-600',  shadow: 'shadow-violet-500/30' },
  ];

  const ATTENDANCE_STATS = [
    { label: 'Days Present',   value: '18', sub: 'This month', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Days Absent',    value: '2',  sub: 'This month', icon: AlertCircle,   color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Hours Worked',   value: '144',sub: 'This month', icon: Clock,         color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Attendance Rate',value: '90%',sub: 'Optimal level', icon: TrendingUp,    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  ];

  const moveWidget = (index, dir) => {
    const next = [...widgets];
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= next.length) return;
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setWidgets(next);
  };

  const WidgetTools = ({ index }) => (
    <div className="flex gap-1 opacity-20 hover:opacity-100 transition-opacity">
      <button onClick={() => moveWidget(index, -1)} disabled={index === 0} className="p-0.5 text-[10px] text-slate-400">▲</button>
      <button onClick={() => moveWidget(index, 1)} disabled={index === widgets.length - 1} className="p-0.5 text-[10px] text-slate-400">▼</button>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {widgets.map((widget, idx) => {
        if (widget === 'welcome') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-indigo-700 to-violet-750 p-6 text-white shadow-xl shadow-indigo-500/20">
                <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-6 right-20 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-indigo-200 text-xs font-semibold">{greeting()},</p>
                    <h1 className="text-2xl font-extrabold mt-0.5">{firstName} 👋</h1>
                    <p className="mt-1.5 text-indigo-100 text-xs max-w-sm">
                      You have completed <span className="text-white font-bold">{tasks.filter(t => t.status === 'completed').length} tasks</span>.
                      Your current active task completion rate is high. Keep it up!
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-indigo-200 text-[10px]">Employee ID</p>
                    <p className="text-lg font-bold">{user?.employeeId ?? '—'}</p>
                    <p className="text-indigo-200 text-xs mt-0.5">{user?.department} · {user?.designation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        if (widget === 'actions') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h2>
                <WidgetTools index={idx} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUICK_LINKS.map(({ label, icon: Icon, href, color, shadow }) => (
                  <Link
                    key={label}
                    to={href}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${color} px-4 py-4 text-white shadow-lg ${shadow} hover:scale-[1.03] hover:shadow-xl transition-all duration-200`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        }

        if (widget === 'stats') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Summary</h2>
                <WidgetTools index={idx} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ATTENDANCE_STATS.map(({ label, value, sub, icon: Icon, color }) => (
                  <Card key={label} className="p-4">
                    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">{label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          );
        }

        if (widget === 'engagement') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate" className="grid gap-5 md:grid-cols-2">
              {/* Employee of the month */}
              <Card className="p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <Trophy className="h-32 w-32" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-widest text-amber-100 flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Employee of the Month
                  </h4>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center font-extrabold text-base">
                      KK
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">Kavitha Kanimozhi</p>
                      <p className="text-[10px] text-amber-100">Senior Engineer · Engineering</p>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-amber-100/90 mt-4 italic">
                  "Acknowledged for visual layout upgrades and robust contribution to UI consistency."
                </p>
              </Card>

              {/* Colleague Birthdays & Holidays */}
              <Card className="p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="h-4 w-4 text-rose-500" /> Holiday & Milestone Reminders
                  </h4>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>Arivoli Subramanian (Birthday)</span>
                      <span className="text-rose-500 font-semibold">July 15</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-2 text-slate-700 dark:text-slate-300">
                      <span>Bakrid (Holiday)</span>
                      <span className="text-slate-400">July 17</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-xs mt-3">
                  Open Calendar
                </Button>
              </Card>
            </motion.div>
          );
        }

        if (widget === 'kudos') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate" className="grid gap-5 md:grid-cols-3">
              {/* Kudos Wall Input */}
              <Card className="p-5 md:col-span-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Star className="h-4 w-4 text-amber-500" /> Kudos Wall
                </h4>
                <form onSubmit={handlePostKudos} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">To (Colleague Name)</label>
                    <input
                      type="text"
                      placeholder="e.g. Kavitha Kanimozhi"
                      value={kudosRecipient}
                      onChange={(e) => setKudosRecipient(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Appreciation Message</label>
                    <textarea
                      placeholder="Write your thank-you note..."
                      rows="3"
                      value={kudosText}
                      onChange={(e) => setKudosText(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <Button type="submit" size="sm" className="w-full">
                    <Send className="h-3.5 w-3.5 mr-1" /> Post Kudos
                  </Button>
                </form>
              </Card>

              {/* Kudos Feed */}
              <Card className="p-5 md:col-span-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Kudos Messages</h4>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {kudosList.map(k => (
                    <div key={k.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">
                          <span className="text-primary">{k.from}</span> appreciated <span className="text-primary">{k.to}</span>
                        </p>
                        <p className="text-xs text-slate-750 mt-1">{k.text}</p>
                      </div>
                      <button 
                        onClick={() => handleLikeKudos(k.id)}
                        className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold border border-rose-100 dark:border-rose-900/30 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors shrink-0"
                      >
                        <Heart className="h-3.5 w-3.5 fill-rose-500" /> {k.hearts}
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        }

        if (widget === 'bottomRow') {
          return (
            <motion.div key={widget} variants={fadeUp} initial="initial" animate="animate" className="grid gap-5 lg:grid-cols-3">
              {/* Tasks List snippet */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Tasks</h4>
                  <Link to="/portal/tasks" className="text-[10px] text-primary font-bold hover:underline">View all</Link>
                </div>
                <div className="space-y-2">
                  {pendingTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex justify-between items-center text-xs p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                      <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">{task.title}</span>
                      <span className="text-[10px] text-slate-400">{task.deadline}</span>
                    </div>
                  ))}
                  {pendingTasks.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">All tasks completed! 🎉</p>
                  )}
                </div>
              </Card>

              {/* Announcements snippets */}
              <Card className="p-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Internal Announcements</h4>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">Annual Town Hall Q3</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tuesday at 3:00 PM IST. Join links distributed via mail.</p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <h5 className="font-bold text-slate-800 dark:text-white">Security SSO Rollout</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Please setup 2FA authenticator profiles prior to Friday.</p>
                  </div>
                </div>
              </Card>

              {/* Upcoming Holidays */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Holidays List</h4>
                  <Link to="/portal/calendar" className="text-[10px] text-primary font-bold hover:underline">Full list</Link>
                </div>
                <div className="space-y-3">
                  {nextHolidays.map((h) => {
                    const d = new Date(h.date);
                    return (
                      <div key={h.id} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
                          <span className="text-[9px] font-bold text-primary uppercase leading-none">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-sm font-extrabold text-primary leading-tight mt-0.5">{d.getDate()}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">{h.name}</p>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider">{h.type}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          );
        }

        return null;
      })}

    </div>
  );
};

export default EmpDashboard;
