import React from "react";
import { LovedOne } from "../../lib/types.ts";
import { LovedOneCard } from "./LovedOneCard.tsx";

interface LovedOnesListProps {
  lovedOnes: LovedOne[];
  onEdit: (loved: LovedOne) => void;
  onDelete: (loved: LovedOne) => void;
  onSchedule: (loved: LovedOne) => void;
}

export const LovedOnesList: React.FC<LovedOnesListProps> = ({
  lovedOnes,
  onEdit,
  onDelete,
  onSchedule,
}) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {lovedOnes.map((loved) => (
      <LovedOneCard
        key={loved.id}
        lovedOne={loved}
        onEdit={() => onEdit(loved)}
        onDelete={() => onDelete(loved)}
        onSchedule={() => onSchedule(loved)}
      />
    ))}
  </div>
);
