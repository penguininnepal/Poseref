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
      {/* Flash icon */}
      <div
        onClick={() => {
          console.log("Flash icon clicked!");
          setShowSelector(true);
        }}
        className="flex flex-col items-center cursor-pointer"
      >
        <span className="text-lg">⚡</span>
        <span className="text-xs capitalize">{mode}</span>
      </div>

      {/* Mode selector overlay */}
      {showSelector && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h3 className="text-white text-lg mb-4">Select Flash Mode</h3>
          <button onClick={() => selectMode("off")} className="bg-gray-700 text-white px-4 py-2 rounded">Flash Off</button>
          <button onClick={() => selectMode("auto")} className="bg-gray-700 text-white px-4 py-2 rounded">Flash On (Capture)</button>
          <button onClick={() => selectMode("always")} className="bg-gray-700 text-white px-4 py-2 rounded">Flash Always On</button>
        </div>
      )}
    </div>
  );
};

export default Flash;
