import { Target } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-20">
      <Target size={64} className="text-[#333] mx-auto mb-4" />
      <p className="text-[#666] text-lg">
        No archers yet.
        <br />
        Click the button below to add one.
      </p>
    </div>
  );
}
