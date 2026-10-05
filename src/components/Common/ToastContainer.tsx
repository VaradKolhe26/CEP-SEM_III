import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-secondary-container text-on-secondary-container border-secondary'
                : toast.type === 'error'
                ? 'bg-error-container text-on-error-container border-error'
                : toast.type === 'warning'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed border-on-tertiary-container'
                : 'bg-surface-container-lowest text-on-surface border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'success'
                ? 'check_circle'
                : toast.type === 'error'
                ? 'error'
                : toast.type === 'warning'
                ? 'warning'
                : 'info'}
            </span>
            <span className="flex-1 font-body-md text-sm">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 p-1 rounded transition-opacity"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
