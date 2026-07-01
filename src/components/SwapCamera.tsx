import { useState } from "react";

const SwapCamera = ({ onSwap }: { onSwap: (newType: "back" | "front") => void }) => {
  const [cameraType, setCameraType] = useState<"back" | "front">("back");

  const handleClick = () => {
    const newType = cameraType === "back" ? "front" : "back";
    setCameraType(newType);
    onSwap(newType);
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer flex-col items-center rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/15"
    >
      <span className="mb-1 text-base">🔄</span>
      <span>{cameraType === "back" ? "Rear" : "Selfie"}</span>
    </div>
  );
};

export default SwapCamera;
