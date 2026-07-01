import { useState } from "react";

const Grid = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`flex cursor-pointer flex-col items-center rounded-full border px-2.5 py-1.5 transition ${enabled ? "border-white/30 bg-white/15" : "border-white/10 bg-white/10"}`}
    >
      <span className="text-sm">⊞</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">{enabled ? "On" : "Off"}</span>
    </div>
  );
};

export default Grid;
