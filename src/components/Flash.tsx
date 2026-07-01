import { useState } from "react";

export type FlashMode = "off" | "auto" | "always";

interface FlashProps {
  cameraType?: "back" | "front";
  onModeChange?: (mode: FlashMode) => void;
}

const Flash: React.FC<FlashProps> = ({ cameraType = "back", onModeChange }) => {
  const [mode, setMode] = useState<FlashMode>("off");
  const [showSelector, setShowSelector] = useState(false);

  const selectMode = (newMode: FlashMode): void => {
    setMode(newMode);
    setShowSelector(false);
    console.log(`Flash mode selected: ${newMode} (camera: ${cameraType})`);
    onModeChange?.(newMode);
  };

  return (
    <div className="relative text-white">
      <div
        onClick={() => {
          setShowSelector(true);
        }}
        className="flex cursor-pointer flex-col items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 transition hover:bg-white/15"
      >
        <span className="text-sm">⚡</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">{mode}</span>
      </div>

      {showSelector && (
        <div className="absolute left-0 top-12 z-50 flex min-w-[180px] flex-col gap-2 rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-2xl">
          <h3 className="text-sm font-semibold text-white">Select flash</h3>
          <button onClick={() => selectMode("off")} className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/15">Off</button>
          <button onClick={() => selectMode("auto")} className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/15">Auto on capture</button>
          <button onClick={() => selectMode("always")} className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm text-white transition hover:bg-white/15">Always on</button>
        </div>
      )}
    </div>
  );
};

export default Flash;
