import { createContext, useCallback, useState, useRef } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounterRef = useRef(0); // Counter to ensure unique IDs

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    // Dùng counter + timestamp cho việc bảo mật id
    const id = `${Date.now()}-${++idCounterRef.current}`;
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto xóa sau duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}
