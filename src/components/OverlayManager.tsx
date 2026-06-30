import { useState } from "react";

const OverlayManager = () => {
  const [overlays, setOverlays] = useState<string[]>([]);

  const addOverlay = () => {
    const newOverlay = `Overlay ${overlays.length + 1}`;
    setOverlays([...overlays, newOverlay]);
  };

  return (
    <div className="absolute left-2 bottom-24">
      <button
        onClick={addOverlay}
        className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
      >
        + Overlay
      </button>

      {/* Show overlays */}
      <div className="mt-2 text-white text-xs">
        {overlays.map((overlay, i) => (
          <div key={i}>{overlay}</div>
        ))}
      </div>
    </div>
  );
};

export default OverlayManager;
