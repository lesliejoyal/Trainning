import { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Label = forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5', className)}
    {...props}
  >
    {children}
  </label>
));
Label.displayName = 'Label';

export const Input = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2',
          error 
            ? 'border-rose-400 bg-rose-50 text-slate-900 focus:border-rose-400 focus:ring-rose-400 dark:bg-rose-900/10 dark:text-white'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export const Select = forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 appearance-none bg-no-repeat',
          error 
            ? 'border-rose-400 bg-rose-50 text-slate-900 focus:border-rose-400 focus:ring-rose-400 dark:bg-rose-900/10 dark:text-white'
            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
});
Select.displayName = 'Select';
