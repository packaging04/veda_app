import React from "react";

interface FavoriteThingsListProps {
  favorites: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, value: string) => void;
}

export const FavoriteThingsList: React.FC<FavoriteThingsListProps> = ({
  favorites,
  onAdd,
  onRemove,
  onUpdate,
}) => (
  <div>
    <label className="block text-sm font-medium text-[#1a2332] mb-2">
      Favorite Things
    </label>
    {favorites.map((thing, idx) => (
      <div key={idx} className="flex gap-2 mb-2">
        <input
          type="text"
          value={thing}
          onChange={(e) => onUpdate(idx, e.target.value)}
          placeholder="e.g., Gardening, Reading"
          className="flex-1 px-4 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors"
        />
        {favorites.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Remove"
          >
            <svg
              className="w-5 h-5"
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
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="text-sm text-[#d4af37] hover:underline"
    >
      + Add another favorite thing
    </button>
  </div>
);
