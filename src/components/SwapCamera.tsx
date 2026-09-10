import { useState } from "react";

const SwapCamera = ({
  onSwap,
  disabled = false,
}: {
  onSwap: (newType: "back" | "front") => void;
  disabled?: boolean;
}) => {
  const [cameraType, setCameraType] = useState<"back" | "front">("back");

  const handleClick = () => {
    if (disabled) return;
    const newType = cameraType === "back" ? "front" : "back";
    setCameraType(newType);
    onSwap(newType);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label="Switch camera"
      title={cameraType === "back" ? "Switch to front camera" : "Switch to rear camera"}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-xl transition active:scale-95 ${
        disabled ? "bg-white/5 text-white/30" : "bg-white/10 text-white/90 hover:bg-white/20"
      }`}
    >
      <span className="inline-block transition-transform duration-300" key={cameraType}>
        {cameraType === "back" ? "🤳" : "📷"}
      </span>
    </button>
  );
};

export default SwapCamera;
