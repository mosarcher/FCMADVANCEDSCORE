"use client";

import React from "react";
import { Save, PlusCircle } from "lucide-react";

/**
 * ActionButtonsProps interface
 * Dit vertelt TypeScript dat deze variabelen 'alles' mogen zijn.
 * Dit lost de "implicitly has an 'any' type" fout op in Vercel.
 */
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
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Knop voor een Nieuw Spel */}
        <button
          onClick={onNewGame}
          className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
        >
          <PlusCircle size={20} />
          <span>Nieuw Spel</span>
        </button>

        {/* Knop voor Opslaan */}
        <button
          onClick={onSaveGame}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 ${
            isSaving
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Save size={20} className={isSaving ? "animate-pulse" : ""} />
          <span>{isSaving ? "Opslaan..." : "Spel Opslaan"}</span>
        </button>

        {/* Optioneel: Toon het Game ID als referentie */}
        {gameId && (
          <div className="flex items-center text-gray-500 text-xs italic ml-auto bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Sessie: {gameId}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionButtons;
