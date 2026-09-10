import { useState } from "react";

const SwapCamera = ({ onSwap }: { onSwap: (newType: "back" | "front") => void }) => {
  const [cameraType, setCameraType] = useState<"back" | "front">("back");

  const handleClick = () => {
    const newType = cameraType === "back" ? "front" : "back";
    setCameraType(newType);
    onSwap(newType);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Switch camera"
      title={cameraType === "back" ? "Switch to front camera" : "Switch to rear camera"}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white/90 transition hover:bg-white/20 active:scale-95"
    >
      <span className="inline-block transition-transform duration-300" key={cameraType}>
        {cameraType === "back" ? "🤳" : "📷"}
      </span>
    </button>
  );
};

export default SwapCamera;
