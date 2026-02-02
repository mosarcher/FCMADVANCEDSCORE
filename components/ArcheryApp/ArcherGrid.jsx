import React from "react";
import { ArcherCard } from "./ArcherCard";

export function ArcherGrid({ archers, calculateTotal, ...props }) {
  // Bepaal de hoogste score voor de groene kleur
  const allTotals = archers.map((a) => calculateTotal(a.scores));
  const topScore = Math.max(...allTotals, 0);

  if (archers.length === 0) {
    return (
      <div className="text-gray-500 text-center py-10 italic">
        Geen actieve schutters. Klik op 'Add Archer'.
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-20">
      {archers.map((archer) => {
        const total = calculateTotal(archer.scores);
        return (
          <ArcherCard
            key={archer.id}
            archer={archer}
            total={total}
            // De winnaar wordt groen
            isLeader={total === topScore && topScore > 0}
            {...props}
          />
        );
      })}
    </div>
  );
}
