import { X, Save, Trash2, Users } from "lucide-react";
import { useState } from "react";

export function ManageArchersModal({
  savedArchers,
  onClose,
  onSaveArcherName,
  onDeleteSavedArcher,
}: any) {
  const [newArcherName, setNewArcherName] = useState("");

  const handleSaveArcher = () => {
    if (newArcherName.trim()) {
      onSaveArcherName(newArcherName.trim());
      setNewArcherName("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#FFC107]">
              Manage Saved Archers
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#FFC107]" />
            </button>
          </div>
          <p className="text-[#888] text-sm">
            ÒÒ Add or remove saved archer names
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Add New Saved Archer */}
          <div className="mb-6">
            <label className="block text-[#888] text-sm mb-2">
              Add New Archer to Saved List
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newArcherName}
                onChange={(e) => setNewArcherName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newArcherName.trim()) {
                    handleSaveArcher();
                  }
                }}
                placeholder="Enter archer name..."
                className="flex-1 bg-[#2a2a2a] text-white p-3 rounded-lg border border-[#444] focus:border-[#FFC107] focus:outline-none"
              />
              <button
                onClick={handleSaveArcher}
                disabled={!newArcherName.trim()}
                className="px-6 py-3 bg-[#FFC107] text-[#1a1a1a] rounded-lg font-semibold hover:bg-[#FFD54F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>

          {/* Saved Archers List */}
          {savedArchers.length > 0 ? (
            <>
              <div className="text-[#888] text-sm mb-3 uppercase tracking-wide">
                Saved Archers ({savedArchers.length})
              </div>
              <div className="space-y-2">
                {savedArchers.map((archer: any) => (
                  <div
                    key={archer.id}
                    className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-[#333]"
                  >
                    <span className="font-semibold text-white">
                      {archer.name}
                    </span>
                    <button
                      onClick={() => {
                        if (
                          confirm(`Delete "${archer.name}" from saved archers?`)
                        ) {
                          onDeleteSavedArcher(archer.id);
                        }
                      }}
                      className="p-2 bg-[#3a1a1a] border border-[#5a2a2a] rounded-lg hover:bg-[#4a1a1a] transition-colors"
                    >
                      <Trash2 size={18} className="text-[#ff6b6b]" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <Users size={48} className="text-[#333] mx-auto mb-3" />
              <p className="text-[#666]">No saved archers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
