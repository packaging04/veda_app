import React from "react";

interface EmptyStateProps {
  onAdd: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAdd }) => (
  <div className="bg-white p-12 rounded-lg text-center">
    <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-10 h-10 text-[#d4af37]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <p className="text-[#1a2332]/60 mb-4">No loved ones added yet</p>
    <button
      onClick={onAdd}
      type="button"
      className="text-[#d4af37] font-medium hover:underline"
    >
      Add your first loved one
    </button>
  </div>
);
