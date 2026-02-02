"use client";

import React from "react";
import { Trophy, Trash2, ChevronDown } from "lucide-react";

interface ArcherCardProps {
  archer: {
    id: string;
    name: string;
    scores: (string | number)[];
  };
  total: number;
  isLeader: boolean;
  expandedId: string | null;
  onUpdateName: (id: string, name: string) => void;
  onUpdateScore: (id: string, idx: number, val: string) => void;
  onDeleteArcher: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export function ArcherCard({
  archer,
  total,
  isLeader,
  expandedId,
  onUpdateName,
  onUpdateScore,
  onDeleteArcher,
  onToggleExpand,
}: ArcherCardProps) {
  const isExpanded = expandedId === archer.id;

  return (
    <div
      className={`bg-[#1e1e1e] rounded-2xl border transition-all duration-500 overflow-hidden mb-3 ${
        isLeader
          ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
          : "border-[#333]"
      }`}
    >
      {/* HEADER - Klikbaar om te openen */}
      <div
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => onToggleExpand(archer.id)}
      >
        {/* Score Badge - Verandert van Geel naar Groen bij winst */}
        <div
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-black font-black shrink-0 shadow-lg transition-colors duration-500 ${
            isLeader ? "bg-emerald-500" : "bg-[#FFC107]"
          }`}
        >
          {isLeader && <Trophy size={14} className="mb-0.5 animate-bounce" />}
          <span className="text-2xl leading-none">{total}</span>
          <span className="text-[8px] uppercase font-bold tracking-tighter">
            {isLeader ? "Winner" : "Total"}
          </span>
        </div>

        {/* Naam Input */}
        <div className="flex-1">
          <input
            value={archer.name}
            onChange={(e) => onUpdateName(archer.id, e.target.value)}
            placeholder="Naam schutter..."
            className={`bg-transparent text-xl font-bold outline-none w-full placeholder:text-gray-700 transition-colors ${
              isLeader ? "text-emerald-400" : "text-white"
            }`}
            onClick={(e) => e.stopPropagation()} // Voorkom inklappen bij typen
          />
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
            {isExpanded ? "Tik om te sluiten" : "Tik om rondes te zien"}
          </p>
        </div>

        {/* Status Icoon */}
        <div className="flex items-center gap-2">
          {isLeader && !isExpanded && (
            <Trophy size={16} className="text-emerald-500" />
          )}
          <ChevronDown
            className={`text-gray-600 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* RONDELIJST - Alleen zichtbaar als kaart is uitgeklapt */}
      {isExpanded && (
        <div className="p-4 border-t border-[#333] bg-black/20 animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              Rondes (50)
            </span>
            <span className="text-[#FFC107] text-[10px] font-bold animate-pulse">
              Scroll opzij →
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar">
            {archer.scores.map((score, idx) => (
              <div key={idx} className="flex-shrink-0 snap-start">
                <label className="block text-[8px] text-gray-600 text-center mb-1 uppercase font-bold">
                  R{idx + 1}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={score}
                  onChange={(e) =>
                    onUpdateScore(archer.id, idx, e.target.value)
                  }
                  className={`w-14 h-12 bg-[#2a2a2a] text-white border rounded-xl text-center font-bold focus:border-[#FFC107] outline-none transition-all shadow-inner ${
                    isLeader ? "border-emerald-500/30" : "border-[#444]"
                  }`}
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-2 pt-2 border-t border-white/5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteArcher(archer.id);
              }}
              className="text-red-500/40 hover:text-red-500 flex items-center gap-1 text-[10px] font-bold uppercase p-2 transition-colors"
            >
              <Trash2 size={14} /> Archer Verwijderen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
