import { useState } from "react";

const OpacityControl = ({ onChange }: { onChange: (value: number) => void }) => {
  const [opacity, setOpacity] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOpacity(value);
    console.log("Opacity change triggered:", value);
    onChange(value);
  };

  return (
    <div className="flex w-full items-center gap-3">
      <span className="text-sm text-white/70">●</span>
      <input
        type="range"
        min="0"
        max="100"
        value={opacity}
        onChange={handleChange}
        className="w-full accent-white"
      />
    </div>
  );
};

export default OpacityControl;
