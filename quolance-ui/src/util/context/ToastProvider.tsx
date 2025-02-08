// components/ToastProvider.tsx
import React, { ReactNode } from 'react';
import { ToastContainer, toast, ToastOptions, TypeOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </>
  );
};

export const showToast = (message: string, type: TypeOptions = 'default', options?: ToastOptions, position: ToastPosition = 'top-right') => {
  toast(message, { type, ...options, position });
};

export default ToastProvider;
