import { X, History, Trash2 } from "lucide-react";

export function HistoryModal({
  pastGames,
  currentGameId,
  calculateTotal,
  onClose,
  onLoadGame,
  onDeleteGame,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#333]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#FFC107]">Past Games</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#FFC107]" />
            </button>
          </div>
          <p className="text-[#888] text-sm">
            Click to load and edit • Trash to delete
          </p>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {pastGames.length === 0 ? (
            <div className="text-center py-20">
              <History size={64} className="text-[#333] mx-auto mb-4" />
              <p className="text-[#666] text-lg">No saved games yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastGames.map((game) => {
                const archerCount = game.data.archers.length;
                const totalScores = game.data.archers.reduce(
                  (sum, archer) => sum + calculateTotal(archer.scores),
                  0,
                );
                const isCurrentGame = currentGameId === game.id;

                return (
                  <div
                    key={game.id}
                    className={`${
                      isCurrentGame ? "bg-[#2a2a2a]" : "bg-[#222]"
                    } p-4 rounded-xl border-2 ${
                      isCurrentGame ? "border-[#FFC107]" : "border-[#333]"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <button
                        onClick={() => onLoadGame(game)}
                        className="flex-1 text-left"
                      >
                        <h3 className="text-[#FFC107] text-lg font-bold mb-2">
                          {new Date(game.game_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </h3>
                        <p className="text-[#888] text-sm mb-2">
                          {archerCount} archer{archerCount !== 1 ? "s" : ""} •{" "}
                          {totalScores} total points
                        </p>

                        {/* Top 3 Archers */}
                        {game.data.archers.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {game.data.archers
                              .sort(
                                (a, b) =>
                                  calculateTotal(b.scores) -
                                  calculateTotal(a.scores),
                              )
                              .slice(0, 3)
                              .map((archer, idx) => (
                                <p
                                  key={idx}
                                  className={`text-xs ${
                                    idx === 0 ? "text-[#FFC107]" : "text-[#666]"
                                  }`}
                                >
                                  {idx + 1}. {archer.name} -{" "}
                                  {calculateTotal(archer.scores)} pts
                                </p>
                              ))}
                          </div>
                        )}

                        {isCurrentGame && (
                          <div className="inline-block mt-3 bg-[#FFC107] px-2 py-1 rounded text-[#1a1a1a] text-xs font-bold">
                            ✓ CURRENTLY LOADED
                          </div>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGame(game);
                        }}
                        className="p-3 bg-[#3a1a1a] border border-[#5a2a2a] rounded-lg hover:bg-[#4a1a1a] transition-colors"
                      >
                        <Trash2 size={20} className="text-[#ff6b6b]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
