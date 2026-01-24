import React from "react";
import { supabase } from "../../lib/supabase.ts";
import { LovedOne } from "../../lib/types.ts";

interface LovedOneCardProps {
  lovedOne: LovedOne;
  onEdit: () => void;
  onDelete: () => void;
  onSchedule: () => void;
}

export const LovedOneCard: React.FC<LovedOneCardProps> = ({
  lovedOne,
  onEdit,
  onDelete,
  onSchedule,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      {lovedOne.profile_image_1 && (
        <img
          src={
            supabase.storage
              .from("loved-ones-images")
              .getPublicUrl(lovedOne.profile_image_1).data.publicUrl
          }
          alt={lovedOne.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]"
        />
      )}
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 text-[#1a2332]/40 hover:text-[#d4af37] transition-colors"
          title="Edit"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-[#1a2332]/40 hover:text-red-500 transition-colors"
          title="Delete"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <h3 className="text-lg font-serif text-[#1a2332] mb-1">{lovedOne.name}</h3>
    <p className="text-[#1a2332]/60 text-sm mb-1">
      {lovedOne.relationship}
      {lovedOne.age && ` • ${lovedOne.age} years old`}
    </p>
    <p className="text-[#1a2332]/40 text-sm mb-2">
      {lovedOne.phone || "No phone added"}
    </p>

    {lovedOne.favorite_things && lovedOne.favorite_things.length > 0 && (
      <div className="mt-2 pt-2 border-t border-[#1a2332]/10">
        <p className="text-xs text-[#1a2332]/50 mb-1">Loves:</p>
        <div className="flex flex-wrap gap-1">
          {lovedOne.favorite_things.slice(0, 3).map((thing, idx) => (
            <span
              key={idx}
              className="text-xs bg-[#d4af37]/10 text-[#1a2332]/70 px-2 py-0.5 rounded"
            >
              {thing}
            </span>
          ))}
          {lovedOne.favorite_things.length > 3 && (
            <span className="text-xs text-[#1a2332]/50">
              +{lovedOne.favorite_things.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}

    <div className="mt-4 pt-4 border-t border-[#1a2332]/10">
      <button
        onClick={onSchedule}
        className="w-full py-2 text-sm text-[#d4af37] font-medium hover:bg-[#d4af37]/5 rounded transition-colors"
      >
        Schedule Call
      </button>
    </div>
  </div>
);
