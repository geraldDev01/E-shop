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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {type === 'success' ? (
              <IoCheckmarkCircle className="w-16 h-16 text-green-500" />
            ) : (
              <IoWarning className="w-16 h-16 text-red-500" />
            )}
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-md text-white ${
              type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}; 