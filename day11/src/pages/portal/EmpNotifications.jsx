import { Bell, Calendar, DollarSign, Megaphone, CheckSquare, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const ICON_MAP = {
  leave: Calendar,
  payroll: DollarSign,
  announcement: Megaphone,
  task: CheckSquare,
};

const COLOR_MAP = {
  leave: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600',
  payroll: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600',
  announcement: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600',
  task: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600',
};

const EmpNotifications = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const handleMarkRead = (id) => {
    markRead(id);
    toast.success('Notification marked as read');
  };

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success('All notifications marked as read');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep track of leave approvals, payroll payslips, and company news
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead}>
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark All Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {notifications.map((n) => {
          const Icon = ICON_MAP[n.type] || Bell;
          const colorClass = COLOR_MAP[n.type] || 'bg-slate-50 text-slate-600';
          
          return (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-4 p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                !n.read ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon wrapper */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className={`font-semibold text-sm ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
                </div>
              </div>

              {!n.read && (
                <Button variant="ghost" size="sm" onClick={() => handleMarkRead(n.id)}>
                  Mark Read
                </Button>
              )}
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No notifications available.
          </div>
        )}
      </Card>

    </div>
  );
};

export default EmpNotifications;
