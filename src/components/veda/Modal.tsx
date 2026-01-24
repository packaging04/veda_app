import React from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-[#1a2332]/40 hover:text-[#1a2332] transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h3 className="text-xl font-serif text-[#1a2332] mb-6">{title}</h3>
      {children}
    </div>
  </div>
);
