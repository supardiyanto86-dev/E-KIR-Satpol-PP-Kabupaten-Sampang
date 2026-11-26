import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/inventory';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print px-4 sm:px-0"
    >
      {toasts.map((t) => {
        const style =
          t.type === 'success'
            ? 'bg-emerald-950 text-white border-emerald-800'
            : t.type === 'error'
            ? 'bg-rose-950 text-white border-rose-800'
            : 'bg-slate-900 text-white border-slate-700';

        const Icon =
          t.type === 'success'
            ? CheckCircle2
            : t.type === 'error'
            ? AlertCircle
            : Info;

        const iconColor =
          t.type === 'success'
            ? 'text-emerald-400'
            : t.type === 'error'
            ? 'text-rose-400'
            : 'text-blue-400';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium ${style}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="truncate">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
