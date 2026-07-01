import { useState } from "react";

const OverlayManager = () => {
  const [overlays, setOverlays] = useState<string[]>([]);

  const addOverlay = () => {
    const newOverlay = `Overlay ${overlays.length + 1}`;
    setOverlays((current) => [...current, newOverlay]);
    console.log("Overlay added", newOverlay);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={addOverlay}
        className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/90 transition hover:bg-white/15"
      >
        +
      </button>
      <div className="hidden text-white/70 text-[10px] sm:block">{overlays.length} overlays</div>
    </div>
  );
};

export default OverlayManager;
