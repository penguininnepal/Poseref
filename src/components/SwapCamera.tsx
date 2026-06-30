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
      className="flex flex-col items-center text-sm cursor-pointer text-white"
    >
      <span>🔄</span>
      <span>{cameraType === "back" ? "Back camera active" : "Front camera active"}</span>
    </div>
  );
};

export default SwapCamera;
