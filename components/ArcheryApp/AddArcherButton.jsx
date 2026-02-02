import { Plus } from "lucide-react";

export function AddArcherButton({ onClick }) {
  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 sm:px-6 max-w-7xl mx-auto">
      <button
        onClick={onClick}
        className="w-full sm:w-auto sm:mx-auto sm:block bg-[#FFC107] text-[#1a1a1a] py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:bg-[#FFD54F] transition-colors"
      >
        <Plus size={24} />
        Add Archer
      </button>
    </div>
  );
}
