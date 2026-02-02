"use client";
import React from "react";
import { useArchers } from "@/hooks/useArchers";
import { ArcherGrid } from "@/components/ArcheryApp/ArcherGrid";
import { PlusCircle } from "lucide-react";
// Importeer Image als je Next.js optimalisatie wilt gebruiken
import Image from "next/image";

export default function ArcheryPage() {
  const { archers, addArcher } = useArchers();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a1a1a] text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          {/* Logo Sectie */}
          <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-yellow-500 bg-white">
            <img
              src="/logo.png" // CONTROLEER: Staat je logo in de public map als logo.png?
              alt="La Fidélité Constantia Logo"
              className="object-contain w-full h-full"
              onError={(e) => {
                // Fallback als de afbeelding niet laadt
                e.currentTarget.src =
                  "https://via.placeholder.com/150?text=LFC";
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LA FIDÉLITÉ</h1>
            <p className="text-xs text-yellow-500 font-mono tracking-[0.2em]">
              CONSTANTIA
            </p>
          </div>
        </div>

        <button
          onClick={() => addArcher("")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <PlusCircle size={18} /> Add Archer
        </button>
      </header>

      {/* Rest van de content... */}
    </div>
  );
}
