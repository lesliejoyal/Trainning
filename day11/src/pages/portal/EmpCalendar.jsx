import { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { useHolidays } from '../../hooks/useHolidays';
import { useLeaves } from '../../hooks/useLeaves';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const INITIAL_MEETINGS = [
  { id: 'm1', title: 'Q3 Product Sync', time: '10:00 AM - 11:00 AM', date: '2026-07-15', description: 'Monthly project sync and roadmap updates' },
  { id: 'm2', title: 'One-on-One Check-in', time: '02:00 PM - 02:30 PM', date: '2026-07-20', description: 'Regular bi-weekly check-in' },
  { id: 'm3', title: 'Town Hall Meeting', time: '03:00 PM - 04:30 PM', date: '2026-07-28', description: 'All-hands company announcement session' },
];

const EmpCalendar = () => {
  const { holidays } = useHolidays();
  const { leaves } = useLeaves();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2026);

  // Custom user scheduled meetings local state
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem(`ems_meetings_${user?.id}`);
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [newMeeting, setNewMeeting] = useState({ title: '', time: '', date: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const saveMeetings = (updated) => {
    setMeetings(updated);
    localStorage.setItem(`ems_meetings_${user?.id}`, JSON.stringify(updated));
  };

  const handleAddMeeting = (e) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error('Please fill in title, date and time');
      return;
    }
    const created = {
      id: `custom_${Date.now()}`,
      ...newMeeting
    };
    saveMeetings([created, ...meetings]);
    setNewMeeting({ title: '', time: '', date: '', description: '' });
    setShowAddForm(false);
    toast.success('Meeting scheduled successfully! 🗓️');
  };

  const handleDeleteMeeting = (id) => {
    saveMeetings(meetings.filter(m => m.id !== id));
    toast.success('Meeting cancelled');
  };

  // Filter leaves for this employee
  const myLeaves = leaves.filter(
    (l) => (l.employeeId === user?.id || l.employeeName === user?.name) && l.status === 'Approved'
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = [];

    // Check holiday
    const holiday = holidays.find((h) => h.date === dateStr);
    if (holiday) dayEvents.push({ type: 'holiday', name: holiday.name });

    // Check leave
    const leave = myLeaves.find((l) => dateStr >= l.from && dateStr <= l.to);
    if (leave) dayEvents.push({ type: 'leave', name: `Leave: ${leave.type}` });

    // Check meeting
    const dayMeetings = meetings.filter((m) => m.date === dateStr);
    dayMeetings.forEach(m => {
      dayEvents.push({ type: 'meeting', name: m.title });
    });

    // Check birthday (colleague birthdays simulation)
    if (day === 15 && currentMonth === 6) {
      dayEvents.push({ type: 'birthday', name: 'Arivoli S. (Birthday)' });
    }
    if (day === 22 && currentMonth === 6) {
      dayEvents.push({ type: 'birthday', name: 'Meenakshi N. (Birthday)' });
    }

    return dayEvents;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Corporate Calendar</h2>
          <p className="text-xs text-slate-500">Track meetings, holidays, leaves, and colleague milestones</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-1.5" /> Schedule Meeting
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-5 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4">New Meeting details</h3>
          <form onSubmit={handleAddMeeting} className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Meeting Title</label>
              <input type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-transparent text-slate-900 dark:text-white outline-none" placeholder="e.g. Q3 Roadmap review" />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Time Range</label>
              <input type="text" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-transparent text-slate-900 dark:text-white outline-none" placeholder="e.g. 10:00 AM - 11:00 AM" />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Date</label>
              <input type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-transparent text-slate-900 dark:text-white outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Description</label>
              <input type="text" value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-transparent text-slate-900 dark:text-white outline-none" placeholder="Short agenda..." />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end mt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" size="sm">Save Meeting</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Calendar grid */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">&larr;</button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">&rarr;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={idx}
                  className={`min-h-[72px] border border-slate-100 dark:border-slate-800/60 p-1 flex flex-col justify-between rounded-xl ${
                    day ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30' : 'bg-slate-50/20 dark:bg-slate-900/10'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                  <div className="mt-1 space-y-0.5 max-w-full overflow-hidden">
                    {dayEvents.map((ev, eIdx) => {
                      let color = 'bg-slate-100 text-slate-600';
                      if (ev.type === 'holiday') color = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450';
                      else if (ev.type === 'leave') color = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450';
                      else if (ev.type === 'meeting') color = 'bg-primary-light text-primary dark:bg-primary-dark/20 dark:text-primary-light';
                      else if (ev.type === 'birthday') color = 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400';

                      return (
                        <span key={eIdx} className={`text-[8px] font-medium truncate block px-1 py-0.5 rounded ${color}`}>
                          {ev.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4 text-[10px] justify-center flex-wrap pt-3 border-t border-slate-150 dark:border-slate-800">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Holiday</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Leave</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Meeting</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Birthday</span>
          </div>
        </Card>

        {/* Side Panel: Scheduled items */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Meetings Agenda</h3>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {meetings.map((m) => (
                <div key={m.id} className="group relative flex gap-3 items-start border-l-2 border-primary pl-3 py-0.5">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{m.title}</h5>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="h-3 w-3" /> {m.time} · {m.date}
                    </div>
                    {m.description && <p className="text-[10px] text-slate-500 mt-1">{m.description}</p>}
                  </div>
                  <button 
                    onClick={() => handleDeleteMeeting(m.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity shrink-0"
                    title="Cancel meeting"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No meetings scheduled.</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Holiday List</h3>
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1 text-xs">
              {holidays.slice(0, 5).map((h) => (
                <div key={h.id} className="flex justify-between items-center text-slate-650 dark:text-slate-350">
                  <span className="font-semibold">{h.name}</span>
                  <span className="text-[10px] text-slate-400">{h.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default EmpCalendar;
