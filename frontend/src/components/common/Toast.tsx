import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-warm-lg border transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-white border-green-200 text-campus-slate-text'
              : toast.type === 'error'
              ? 'bg-white border-red-200 text-campus-slate-text'
              : toast.type === 'warning'
              ? 'bg-white border-amber-200 text-campus-slate-text'
              : 'bg-white border-blue-200 text-campus-slate-text'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-campus-green" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-campus-red" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-campus-amber" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-campus-blue" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-campus-muted-text">{toast.title}</h4>
            <p className="text-sm font-medium text-campus-slate-text mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-campus-muted-text hover:text-campus-slate-text p-1 -mr-1 -mt-1 rounded-lg hover:bg-campus-warm-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
