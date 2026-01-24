import React from "react";

interface ImageUploadProps {
  label: string;
  preview: string;
  onSelect: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  preview,
  onSelect,
}) => (
  <div>
    <label className="block text-sm font-medium text-[#1a2332] mb-2">
      {label}
    </label>

    {preview ? (
      <div className="relative">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Remove image"
        >
          <svg
            className="w-4 h-4"
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
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#1a2332]/20 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors">
        <svg
          className="w-8 h-8 text-[#1a2332]/40 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs text-[#1a2332]/60">Upload Image</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
        />
      </label>
    )}
  </div>
);
