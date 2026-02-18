import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-surface-dark text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
          
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-5 sm:p-6">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;