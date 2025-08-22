import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message, opts = {}) => {
    const id = ++idRef.current;
    const { type = 'info', duration = 3000 } = opts;
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = useMemo(() => ({
    show: (message, opts) => add(message, opts),
    success: (message, opts) => add(message, { ...opts, type: 'success' }),
    error: (message, opts) => add(message, { ...opts, type: 'error' }),
    info: (message, opts) => add(message, { ...opts, type: 'info' }),
    warning: (message, opts) => add(message, { ...opts, type: 'warning' }),
    remove,
  }), [add, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.container} role="status" aria-live="polite" aria-atomic="true" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.type]}`}
            onClick={() => remove(t.id)}
            onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); remove(t.id);} }}
            tabIndex={0}
            role="alert"
            aria-label={`${t.type} notification: ${t.message}`}
          >
            <button
              className={styles.close}
              aria-label="Close notification"
              onClick={(e) => { e.stopPropagation(); remove(t.id); }}
            >
              ×
            </button>
            <span className={styles.message}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      remove: () => {},
    };
  }
  return ctx;
};

