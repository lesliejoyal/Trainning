import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', isDestructive = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-6">
        <div className={`flex h-12 w-12 mx-auto items-center justify-center rounded-full mb-4 ${isDestructive ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
          <AlertTriangle className={`h-6 w-6 ${isDestructive ? 'text-rose-600 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
        </div>

        <h3 className="text-base font-bold text-center text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold text-white transition-colors shadow-md ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
