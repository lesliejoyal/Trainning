import { Users, Inbox, FileText, Calendar, CheckCircle } from 'lucide-react';

const ICONS = {
  employees: Users,
  inbox: Inbox,
  reports: FileText,
  calendar: Calendar,
  tasks: CheckCircle,
  default: Inbox,
};

export const EmptyState = ({
  icon = 'default',
  title = 'Nothing here yet',
  description = 'Get started by adding your first item.',
  action,
}) => {
  const Icon = ICONS[icon] ?? ICONS.default;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/20">
        <Icon className="h-10 w-10 text-indigo-400 dark:text-indigo-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
