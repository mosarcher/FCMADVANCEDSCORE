import { X, Plus, Check, Users } from "lucide-react";
import { useState } from "react";

export function AddArcherModal({
  savedArchers,
  availableSlots,
  onClose,
  onAddCustomArcher,
  onAddSelectedArchers,
}) {
  const [newArcherName, setNewArcherName] = useState("");
  const [selectedArcherIds, setSelectedArcherIds] = useState([]);

  const toggleArcherSelection = (archerId) => {
    setSelectedArcherIds((prev) => {
      if (prev.includes(archerId)) {
        return prev.filter((id) => id !== archerId);
      } else {
        return [...prev, archerId];
      }
    });
  };

  const handleAddCustomArcher = () => {
    if (newArcherName.trim()) {
      onAddCustomArcher(newArcherName.trim());
      setNewArcherName("");
    }
  };

  const handleAddSelectedArchers = () => {
    const selectedNames = savedArchers
      .filter((archer) => selectedArcherIds.includes(archer.id))
      .map((archer) => archer.name);

    if (selectedNames.length > 0) {
      onAddSelectedArchers(selectedNames);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#FFC107]">Add Archer</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#FFC107]" />
            </button>
          </div>
          <p className="text-[#888] text-sm">
            Select multiple archers or enter a new name • {availableSlots} slot
            {availableSlots !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Custom Name Input */}
          <div className="mb-6">
            <label className="block text-[#888] text-sm mb-2">
              New Archer Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newArcherName}
                onChange={(e) => setNewArcherName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newArcherName.trim()) {
                    handleAddCustomArcher();
                  }
                }}
                placeholder="Enter name..."
                className="flex-1 bg-[#2a2a2a] text-white p-3 rounded-lg border border-[#444] focus:border-[#FFC107] focus:outline-none"
              />
              <button
                onClick={handleAddCustomArcher}
                disabled={!newArcherName.trim()}
                className="px-6 py-3 bg-[#FFC107] text-[#1a1a1a] rounded-lg font-semibold hover:bg-[#FFD54F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Saved Archers List */}
          {savedArchers.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[#888] text-sm uppercase tracking-wide">
                  Saved Archers ({savedArchers.length})
                </div>
                {selectedArcherIds.length > 0 && (
                  <button
                    onClick={() => setSelectedArcherIds([])}
                    className="text-[#FFC107] text-sm hover:underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {savedArchers.map((archer) => {
                  const isSelected = selectedArcherIds.includes(archer.id);
                  return (
                    <button
                      key={archer.id}
                      onClick={() => toggleArcherSelection(archer.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-[#FFC107] border-[#FFC107] text-[#1a1a1a]"
                          : "bg-[#2a2a2a] border-[#444] text-white hover:border-[#FFC107] hover:bg-[#333]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{archer.name}</div>
                        {isSelected && (
                          <Check size={18} className="text-[#1a1a1a]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Selected Button */}
              {selectedArcherIds.length > 0 && (
                <button
                  onClick={handleAddSelectedArchers}
                  className="w-full py-4 bg-[#FFC107] text-[#1a1a1a] rounded-lg font-bold text-lg hover:bg-[#FFD54F] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add {selectedArcherIds.length} Archer
                  {selectedArcherIds.length !== 1 ? "s" : ""}
                </button>
              )}
            </>
          )}

          {savedArchers.length === 0 && (
            <div className="text-center py-10">
              <Users size={48} className="text-[#333] mx-auto mb-3" />
              <p className="text-[#666]">No saved archers yet</p>
              <p className="text-[#666] text-sm mt-1">
                Add archers to your saved list from the manage menu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
