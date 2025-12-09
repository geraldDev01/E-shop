'use client'

import { IoCheckmarkCircle, IoClose, IoWarning } from 'react-icons/io5';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: 'success' | 'error';
}

export const Popup = ({ isOpen, onClose, message, type }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="card rounded-2xl p-8 max-w-md w-full relative animate-fade-in-up shadow-2xl border-2 border-gray-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className={`absolute inset-0 rounded-full blur-xl ${
              type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}></div>
            {type === 'success' ? (
              <IoCheckmarkCircle className="w-20 h-20 text-green-500 relative z-10" />
            ) : (
              <IoWarning className="w-20 h-20 text-red-500 relative z-10" />
            )}
          </div>
          <h3 className={`text-xl font-bold mb-2 ${
            type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {type === 'success' ? '¡Éxito!' : 'Error'}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all ${
              type === 'success' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}; 