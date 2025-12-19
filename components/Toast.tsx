import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    error: 'bg-red-500 text-white border-red-400',
    info: 'bg-blue-600 text-white border-blue-500',
    warning: 'bg-amber-500 text-white border-amber-400',
  };

  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-sm border ${styles[type]} backdrop-blur-md`}>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity p-1">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
         </svg>
      </button>
    </div>
  );
};

export default Toast;