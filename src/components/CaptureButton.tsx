import { useState } from "react";

const CaptureButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const [pressing, setPressing] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    setPressing(true);
    onClick();
    window.setTimeout(() => setPressing(false), 200);
  };

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      aria-label="Take photo"
      className={`group relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[3px] bg-transparent transition active:scale-95 ${
        disabled ? "border-white/25 opacity-50" : "border-white"
      } ${pressing ? "animate-shutterPress" : ""}`}
    >
      <span
        className={`block h-[60px] w-[60px] rounded-full transition-all duration-150 ${
          disabled ? "bg-white/40" : "bg-white group-active:scale-90"
        } ${pressing ? "scale-90" : ""}`}
      />
    </button>
  );
};

export default CaptureButton;
