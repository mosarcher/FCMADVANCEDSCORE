import { Save } from "lucide-react";

export function ActionButtons({ onNewGame, onSaveGame, isSaving, gameId }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-5">
      <div className="flex gap-3">
        <button
          onClick={onNewGame}
          className="flex-1 py-3 px-4 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#FFC107] font-semibold hover:bg-[#333] transition-colors"
        >
          New Game
        </button>
        <button
          onClick={onSaveGame}
          disabled={isSaving}
          className="flex-1 py-3 px-4 bg-[#FFC107] rounded-lg text-[#1a1a1a] font-bold flex items-center justify-center gap-2 hover:bg-[#FFD54F] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : gameId ? "Update Game" : "Save Game"}
        </button>
      </div>
    </div>
  );
}
