'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ToastMessage {
  id: string;
  icon: string;
  title: string;
  description?: string;
  type?: 'achievement' | 'info' | 'success' | 'xp';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const borderColor =
    toast.type === 'achievement' ? 'border-amber-500/40' :
    toast.type === 'xp' ? 'border-indigo-500/40' :
    toast.type === 'success' ? 'border-emerald-500/40' :
    'border-neutral-700';

  const bgGlow =
    toast.type === 'achievement' ? 'from-amber-500/10 to-transparent' :
    toast.type === 'xp' ? 'from-indigo-500/10 to-transparent' :
    toast.type === 'success' ? 'from-emerald-500/10 to-transparent' :
    'from-neutral-800 to-neutral-900';

  return (
    <div
      className={`pointer-events-auto bg-gradient-to-r ${bgGlow} bg-neutral-900 border ${borderColor} rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[280px] max-w-sm animate-slide-in`}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span className="text-2xl shrink-0">{toast.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white m-0">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-neutral-400 m-0 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-neutral-600 hover:text-neutral-400 bg-transparent border-none cursor-pointer text-sm shrink-0"
      >
        {'\u2715'}
      </button>
    </div>
  );
}
