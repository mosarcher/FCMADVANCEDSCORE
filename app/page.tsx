"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useArchers } from "./useArchers";
import {
  Users,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  History,
  Calendar,
  CheckCircle2,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ArcheryPage() {
  const {
    archers,
    setArchers,
    pool,
    loading,
    pastGames,
    addToPool,
    removeFromPool,
    saveCurrentSession,
    archiveGame,
    deletePastGame,
  } = useArchers();

  const [showOpening, setShowOpening] = useState(true);
  const [showPool, setShowPool] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [expandedArcher, setExpandedArcher] = useState<string | null>(null);
  const [swipedItem, setSwipedItem] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  } | null>(null);

  const askConfirmation = (
    title: string,
    message: string,
    action: () => void,
    confirmText = "Bevestigen",
    isDestructive = false
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: action,
      confirmText,
      isDestructive,
    });
  };

  const handleNewGame = () => {
    setArchers([]);
    saveCurrentSession([]);
    setCurrentRound(0);
    setExpandedArcher(null);
    setShowPool(true);
    setShowOpening(false);
  };

  const updateScore = (id: string, roundIdx: number, val: string) => {
    const newArchers = archers.map((a) => {
      if (a.id === id) {
        const newScores = [...a.scores];
        newScores[roundIdx] = val;
        return { ...a, scores: newScores };
      }
      return a;
    });
    setArchers(newArchers);
    saveCurrentSession(newArchers);
  };

  useEffect(() => {
    if (archers.length > 0) setShowOpening(false);
  }, [archers.length]);

  const { sortedArchers, highestActiveScore } = useMemo(() => {
    const withTotals = [...archers].map((a) => ({
      ...a,
      total: a.scores.reduce(
        (sum: number, s: any) => sum + (parseInt(s) || 0),
        0
      ),
    }));
    const maxScore =
      withTotals.length > 0 ? Math.max(...withTotals.map((a) => a.total)) : 0;
    return {
      sortedArchers: withTotals.sort((a, b) => b.total - a.total),
      highestActiveScore: maxScore,
    };
  }, [archers]);

  const winRanking = useMemo(() => {
    const stats: Record<string, number> = {};
    pastGames.forEach((game) => {
      let winnerNames: string[] = [];
      let highestScore = -1;
      game.game_data.forEach((player: any) => {
        const total = player.scores.reduce(
          (s: number, v: any) => s + (parseInt(v) || 0),
          0
        );
        if (total > highestScore) {
          highestScore = total;
          winnerNames = [player.name];
        } else if (total === highestScore && highestScore > 0) {
          winnerNames.push(player.name);
        }
      });
      winnerNames.forEach((name) => {
        stats[name] = (stats[name] || 0) + 1;
      });
    });
    return Object.entries(stats)
      .map(([name, wins]) => ({ name, wins }))
      .sort((a, b) => b.wins - a.wins);
  }, [pastGames]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1a202c] flex items-center justify-center text-[#FFC107] font-black italic uppercase">
        Laden...
      </div>
    );

  const pageBgStyle = {
    backgroundImage: "url('/opening.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed" as const,
  };

  const modalOverlayStyle =
    "absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#1e293b]/90 to-[#334155]/80 backdrop-blur-2xl z-0";

  if (showOpening) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-end pb-32 transition-all duration-700"
        style={pageBgStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a202c] via-transparent to-transparent z-0" />
        <div className="relative z-10 flex flex-col gap-4 w-full max-w-[280px]">
          <button
            onClick={handleNewGame}
            className="w-full bg-[#FFC107] text-[#1a202c] py-5 rounded-full font-black text-xl tracking-tight active:scale-95 shadow-2xl uppercase transition-all"
          >
            Start New Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen text-white flex flex-col font-sans relative"
      style={pageBgStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a202c]/95 via-[#2d3748]/90 to-[#1a202c]/95 z-0" />

      {/* HEADER */}
      <header className="relative z-10 p-3 bg-white/5 backdrop-blur-xl border-b border-white/10 flex justify-between items-center sticky top-0 shadow-xl">
        <button
          onClick={() => setShowOpening(true)}
          className="text-lg font-black text-[#FFC107] tracking-tighter italic uppercase"
        >
          FMC ADVANCED
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPool(true)}
            className="p-2 bg-white/10 rounded-xl border border-white/10 active:scale-95"
          >
            <Users size={20} />
          </button>
          <button
            onClick={() =>
              askConfirmation(
                "Opslaan?",
                "Wil je archiveren?",
                () => archiveGame(archers),
                "Save"
              )
            }
            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/10 active:scale-95"
          >
            <Save size={20} />
          </button>
          <button
            onClick={() =>
              askConfirmation(
                "Reset?",
                "Dit wist alles.",
                handleNewGame,
                "Wissen",
                true
              )
            }
            className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/10 active:scale-95"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* ROUND NAVIGATOR */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md p-3 flex items-center justify-between px-10 border-b border-white/5 sticky top-[61px]">
        <button
          onClick={() => setCurrentRound((r) => Math.max(0, r - 1))}
          className="text-[#FFC107] active:scale-125 transition-transform"
        >
          <ChevronLeft size={36} />
        </button>
        <div className="text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">
            RONDE
          </p>
          <p className="text-3xl font-black text-white mt-1 leading-none">
            {currentRound + 1}
          </p>
        </div>
        <button
          onClick={() => setCurrentRound((r) => Math.min(49, r + 1))}
          className="text-[#FFC107] active:scale-125 transition-transform"
        >
          <ChevronRight size={36} />
        </button>
      </div>

      {/* ARCHERS LIST */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-24">
        {sortedArchers.map((a, idx) => (
          <div
            key={a.id}
            className="flex flex-col border-b border-white/5 bg-white/5 backdrop-blur-sm mb-[1px]"
          >
            <div
              className="flex items-center gap-3 p-4"
              onClick={() =>
                setExpandedArcher(expandedArcher === a.id ? null : a.id)
              }
            >
              <span className="text-xs font-black text-[#FFC107] w-4">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-xl font-black tracking-tighter uppercase truncate leading-none text-white">
                  {a.name}
                </p>
                <p className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest leading-none">
                  Totaal
                </p>
                <p
                  className={`text-2xl font-black mt-1 leading-none ${
                    a.total === highestActiveScore && a.total > 0
                      ? "text-emerald-400"
                      : "text-white"
                  }`}
                >
                  {a.total}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  value={a.scores[currentRound] || ""}
                  onChange={(e) =>
                    updateScore(a.id, currentRound, e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  placeholder="0"
                  className="w-16 bg-black/40 border border-white/10 rounded-xl py-4 text-center text-2xl font-black text-[#FFC107] outline-none"
                />
                <div className="text-white/20">
                  {expandedArcher === a.id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
              </div>
            </div>

            {expandedArcher === a.id && (
              <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-black/40 rounded-2xl border border-white/10 p-3">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 text-center">
                    Alle Ronden (1-50)
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {a.scores.map((s: string, rIdx: number) => (
                      <div
                        key={rIdx}
                        className={`flex flex-col items-center p-1 rounded-lg border transition-all ${
                          rIdx === currentRound
                            ? "bg-[#FFC107]/20 border-[#FFC107]"
                            : "bg-white/5 border-white/5"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentRound(rIdx);
                        }}
                      >
                        <span className="text-[7px] font-black text-white/40 mb-1 uppercase">
                          R{rIdx + 1}
                        </span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={s}
                          onChange={(e) =>
                            updateScore(a.id, rIdx, e.target.value)
                          }
                          className="w-full bg-transparent text-center font-black text-xs text-[#FFC107] outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowHistory(true)}
          className="w-full p-12 text-white/30 flex items-center justify-center gap-2 font-bold text-[10px] tracking-[0.3em] uppercase"
        >
          <History size={16} /> Geschiedenis
        </button>
      </div>

      {/* POOL MODAL */}
      {showPool && (
        <div
          className="fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300"
          style={pageBgStyle}
        >
          <div className={modalOverlayStyle} />
          <div className="relative z-10 p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 sticky top-0 py-2">
              <button
                onClick={() => setShowOpening(true)}
                className="text-2xl font-black text-[#FFC107] italic uppercase tracking-tighter"
              >
                FMC ADVANCED
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHistory(true)}
                  className="p-2 bg-white/10 rounded-full text-[#FFC107] active:scale-95"
                >
                  <History size={20} />
                </button>
                <button
                  onClick={() => setShowPool(false)}
                  className="bg-[#FFC107] text-[#1a202c] px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95"
                >
                  KLAAR
                </button>
              </div>
            </div>
            <div className="px-2 mb-8 relative z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const i = document.getElementById(
                    "pname"
                  ) as HTMLInputElement;
                  if (i.value) {
                    addToPool(i.value);
                    i.value = "";
                  }
                }}
                className="flex items-center gap-2 w-full"
              >
                <input
                  id="pname"
                  type="text"
                  className="flex-1 min-w-0 bg-white/10 p-5 rounded-2xl border border-white/10 text-white placeholder-white/40 outline-none font-bold"
                  placeholder="Naam..."
                />
                <button
                  type="submit"
                  className="bg-[#FFC107] text-[#1a202c] w-14 h-14 flex items-center justify-center rounded-2xl font-black active:scale-95 shadow-lg"
                >
                  <Plus size={28} />
                </button>
              </form>
            </div>
            <div className="px-2 space-y-3 overflow-auto relative z-20 flex-1 pb-10">
              {pool.map((n) => {
                const isActive = archers.some((a) => a.name === n);
                const isSwiped = swipedItem === n;
                return (
                  <div
                    key={n}
                    className="relative rounded-3xl overflow-hidden min-h-[72px]"
                  >
                    {isSwiped && (
                      <div className="absolute inset-y-0 right-0 w-28 bg-red-600 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            askConfirmation(
                              `Wis ${n}?`,
                              "Verwijderen?",
                              () => {
                                removeFromPool(n);
                                setSwipedItem(null);
                              },
                              "Wis",
                              true
                            );
                          }}
                          className="flex flex-col items-center gap-1 text-white font-black text-[10px] uppercase"
                        >
                          <Trash2 size={24} /> <span>Wis</span>
                        </button>
                      </div>
                    )}
                    <div
                      className={`relative p-6 transition-transform duration-300 backdrop-blur-md border flex items-center justify-center cursor-pointer z-10 rounded-3xl h-full ${
                        isActive
                          ? "bg-[#FFC107] border-[#FFC107]"
                          : "bg-white/5 border-white/10"
                      } ${isSwiped ? "-translate-x-28" : "translate-x-0"}`}
                      onClick={() => {
                        if (isSwiped) setSwipedItem(null);
                        else {
                          if (isActive)
                            setArchers(archers.filter((a) => a.name !== n));
                          else
                            setArchers([
                              ...archers,
                              {
                                id: Math.random().toString(36).substr(2, 9),
                                name: n,
                                scores: Array(50).fill(""),
                              },
                            ]);
                        }
                      }}
                      onTouchStart={(e) => {
                        (e.currentTarget as any).startX = e.touches[0].clientX;
                      }}
                      onTouchMove={(e) => {
                        const diff =
                          (e.currentTarget as any).startX -
                          e.touches[0].clientX;
                        if (diff > 50) setSwipedItem(n);
                        if (diff < -50) setSwipedItem(null);
                      }}
                    >
                      <div className="absolute left-6">
                        {isActive && (
                          <CheckCircle2 size={24} className="text-[#1a202c]" />
                        )}
                      </div>
                      <span
                        className={`font-black text-xl uppercase tracking-widest text-center ${
                          isActive ? "text-[#1a202c]" : "text-white"
                        }`}
                      >
                        {n}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY & PAST GAMES MODAL */}
      {showHistory && (
        <div
          className="fixed inset-0 z-[200] flex flex-col animate-in slide-in-from-bottom duration-300"
          style={pageBgStyle}
        >
          <div className={modalOverlayStyle} />
          <div className="relative z-10 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-8 sticky top-0 py-2">
              <h2 className="text-2xl font-black text-[#FFC107] italic uppercase">
                History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="bg-white/10 p-2 rounded-full active:scale-95 transition-transform"
              >
                <XCircle size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-10 pb-20 pr-1">
              {/* Hall of Fame */}
              <section>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Trophy size={14} className="text-[#FFC107]" /> Hall of Fame
                </h3>
                <div className="space-y-3">
                  {winRanking.length === 0 && (
                    <p className="text-white/20 italic text-xs text-center">
                      Nog geen winnaars bekend
                    </p>
                  )}
                  {winRanking.map((r) => (
                    <div
                      key={r.name}
                      className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
                    >
                      <span className="font-black text-lg text-white uppercase">
                        {r.name}
                      </span>
                      <span className="font-black text-xl text-[#FFC107] flex items-center gap-2">
                        {r.wins} <Trophy size={18} />
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Past Games List with Swipe */}
              <section>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Vorige Games
                </h3>
                <div className="space-y-3">
                  {pastGames.length === 0 && (
                    <p className="text-white/20 italic text-xs text-center">
                      Geen geschiedenis gevonden
                    </p>
                  )}
                  {pastGames.map((game) => {
                    const gameId = game.id.toString();
                    const isSwiped = swipedItem === gameId;
                    const date = new Date(game.created_at).toLocaleDateString(
                      "nl-NL",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    return (
                      <div
                        key={gameId}
                        className="relative rounded-2xl overflow-hidden min-h-[84px]"
                      >
                        {/* Delete Action (Swipe Left) */}
                        {isSwiped && (
                          <div className="absolute inset-y-0 right-0 w-24 bg-red-600 flex items-center justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                askConfirmation(
                                  "Game wissen?",
                                  "Dit verwijdert dit potje definitief.",
                                  () => {
                                    deletePastGame(game.id);
                                    setSwipedItem(null);
                                  },
                                  "Wis",
                                  true
                                );
                              }}
                              className="flex flex-col items-center gap-1 text-white font-black text-[10px] uppercase"
                            >
                              <Trash2 size={24} /> <span>Wis</span>
                            </button>
                          </div>
                        )}

                        <div
                          className={`relative p-5 bg-white/5 border border-white/10 backdrop-blur-md transition-transform duration-300 z-10 rounded-2xl flex justify-between items-center ${
                            isSwiped ? "-translate-x-24" : "translate-x-0"
                          }`}
                          onTouchStart={(e) => {
                            (e.currentTarget as any).startX =
                              e.touches[0].clientX;
                          }}
                          onTouchMove={(e) => {
                            const diff =
                              (e.currentTarget as any).startX -
                              e.touches[0].clientX;
                            if (diff > 50) setSwipedItem(gameId);
                            if (diff < -50) setSwipedItem(null);
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                              {date}
                            </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {game.game_data.map((player: any) => (
                                <span
                                  key={player.id}
                                  className="text-[10px] font-bold text-white/70 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase"
                                >
                                  {player.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] font-black text-[#FFC107] uppercase block">
                              Players
                            </span>
                            <span className="text-xl font-black text-white">
                              {game.game_data.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1a202c] border border-white/10 rounded-[2.5rem] w-full max-w-xs p-8 text-center shadow-2xl">
            <h3 className="text-[#FFC107] font-black text-xl uppercase italic mb-2 tracking-tighter">
              {confirmDialog.title}
            </h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed px-2">
              {confirmDialog.message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest ${
                  confirmDialog.isDestructive
                    ? "bg-red-600"
                    : "bg-[#FFC107] text-[#1a202c]"
                }`}
              >
                {confirmDialog.confirmText}
              </button>
              <button
                onClick={() => setConfirmDialog(null)}
                className="w-full py-5 rounded-2xl bg-white/5 text-white/40 font-bold text-xs uppercase"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
