"use client";

import React from "react";
import { Save, PlusCircle } from "lucide-react";

interface ActionButtonsProps {
  onNewGame: any;
  onSaveGame: any;
  isSaving: any;
  gameId: any;
}

export function ActionButtons({
  onNewGame,
  onSaveGame,
  isSaving,
  gameId,
}: ActionButtonsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-5">
      <div className="flex gap-3">
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 bg-yellow-500 p-3 rounded shadow font-bold"
        >
          <PlusCircle size={20} /> Nieuw Spel
        </button>
        <button
          onClick={onSaveGame}
          disabled={isSaving}
          className="flex items-center gap-2 bg-green-600 text-white p-3 rounded shadow font-bold"
        >
          <Save size={20} /> {isSaving ? "Opslaan..." : "Spel Opslaan"}
        </button>
      </div>
    </div>
  );
}
