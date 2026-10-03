import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useTimetable();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 animate-slide-up ${
              isSuccess
                ? 'bg-white/95 dark:bg-darkbg-800/95 border-brand-300 text-brand-950 dark:text-brand-100'
                : isWarning
                ? 'bg-white/95 dark:bg-darkbg-800/95 border-amber-300 text-amber-950 dark:text-amber-100'
                : isError
                ? 'bg-white/95 dark:bg-darkbg-800/95 border-red-300 text-red-950 dark:text-red-100'
                : 'bg-white/95 dark:bg-darkbg-800/95 border-orange-200 text-slate-800 dark:text-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {isError && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              {!isSuccess && !isWarning && !isError && (
                <Info className="w-5 h-5 text-citrus-600 dark:text-citrus-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
