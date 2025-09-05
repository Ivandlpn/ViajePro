
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      aria-labelledby="confirmation-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md animate-fade-in-up"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirmation-title" className="text-2xl font-bold text-[#1A4488] mb-4">{title}</h2>
        <p className="text-[#333333] mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-md text-[#333333] hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-2 bg-[#CB1823] text-white font-bold rounded-md hover:bg-red-700 transition shadow-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
