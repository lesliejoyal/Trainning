import { CalendarCheck, Play, Square, Award, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const EmpAttendance = () => {
  const { user } = useAuth();
  const { records, addRecord, updateRecord } = useAttendance();

  // Find all attendance records for this logged-in user (match by employeeId or employeeName)
  const myRecords = records.filter(
    (r) => r.employeeId === user?.id || r.employeeName === user?.name
  );

  // Check if check-in exists for today
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayRecord = myRecords.find((r) => r.date === todayDateStr);

  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleCheckIn = () => {
    if (todayRecord) {
      toast.error('Already checked in for today!');
      return;
    }

    const checkInTime = new Date();
    const timeStr = formatTime(checkInTime);
    
    // Status depends on check-in time (e.g. after 09:00 is Late)
    const isLate = checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0);
    const status = isLate ? 'Late' : 'Present';

    addRecord({
      date: todayDateStr,
      employeeId: user?.id || '1',
      employeeName: user?.name || 'Jane Cooper',
      department: user?.department || 'Engineering',
      status,
      checkIn: timeStr,
      checkOut: '',
    });

    toast.success(`Successfully Checked In at ${timeStr}`);
  };

  const handleCheckOut = () => {
    if (!todayRecord) {
      toast.error('You need to check in first!');
      return;
    }
    if (todayRecord.checkOut) {
      toast.error('Already checked out for today!');
      return;
    }

    const checkOutTime = new Date();
    const timeStr = formatTime(checkOutTime);

    updateRecord(todayRecord.id, {
      checkOut: timeStr,
    });

    toast.success(`Successfully Checked Out at ${timeStr}`);
  };

  // Stats calculation
  const totalDays = myRecords.length || 1;
  const presentDays = myRecords.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day').length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const lateCount = myRecords.filter((r) => r.status === 'Late').length;

  // Overtime summary (days with > 8 working hours)
  const overtimeCount = myRecords.filter((r) => {
    if (!r.checkIn || !r.checkOut) return false;
    const [inH, inM] = r.checkIn.split(':').map(Number);
    const [outH, outM] = r.checkOut.split(':').map(Number);
    const durationHours = (outH + outM / 60) - (inH + inM / 60);
    return durationHours > 8.5; // accounting for 30m break
  }).length;

  return (
    <div className="space-y-6">
      {/* Upper Panel: Actions and Info */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Attendance Action Widget */}
        <Card className="p-6 md:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Punch</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Record your daily work shift times</p>
          </div>

          <div className="my-6 text-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              variant={todayRecord ? 'secondary' : 'primary'}
              onClick={handleCheckIn}
              disabled={!!todayRecord}
            >
              <Play className="mr-2 h-4 w-4" /> Check In
            </Button>
            <Button
              className="flex-1"
              variant={todayRecord?.checkOut || !todayRecord ? 'secondary' : 'danger'}
              onClick={handleCheckOut}
              disabled={!todayRecord || !!todayRecord?.checkOut}
            >
              <Square className="mr-2 h-4 w-4" /> Check Out
            </Button>
          </div>

          {todayRecord && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Punch In: <strong>{todayRecord.checkIn}</strong></span>
              <span>Punch Out: <strong>{todayRecord.checkOut || '—'}</strong></span>
            </div>
          )}
        </Card>

        {/* Stats Column */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2">
          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Attendance Rate</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
                <CalendarCheck className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{attendanceRate}%</span>
              <p className="text-xs text-slate-500 mt-1">Total Present: {presentDays} days</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Late Check-Ins</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{lateCount}</span>
              <p className="text-xs text-slate-500 mt-1">Requires punctual arrivals</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Overtime Days</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{overtimeCount}</span>
              <p className="text-xs text-slate-500 mt-1">Days worked &gt; 8 hours</p>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Overall Standing</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center">
                <Award className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">Good</span>
              <p className="text-xs text-slate-500 mt-1">Consistency rating score</p>
            </div>
          </Card>
        </div>

      </div>

      {/* History log */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance Logs</h3>
            <p className="text-xs text-slate-500">Chronological history of checked shifts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Check In</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Check Out</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Hours Worked</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myRecords.map((r) => {
                let duration = '—';
                if (r.checkIn && r.checkOut) {
                  const [inH, inM] = r.checkIn.split(':').map(Number);
                  const [outH, outM] = r.checkOut.split(':').map(Number);
                  const durationHours = (outH + outM / 60) - (inH + inM / 60);
                  duration = `${durationHours.toFixed(1)} hrs`;
                }

                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{r.checkIn || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{r.checkOut || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{duration}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'danger'}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmpAttendance;
