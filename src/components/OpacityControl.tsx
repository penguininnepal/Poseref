import { useState } from "react";

const OpacityControl = ({ onChange }: { onChange: (value: number) => void }) => {
  const [opacity, setOpacity] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOpacity(value);
    onChange(value);
  };

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-3/4">
      <input
        type="range"
        min="0"
        max="100"
        value={opacity}
        onChange={handleChange}
        className="w-full accent-yellow-400"
      />
      <p className="text-white text-xs text-center mt-1">Opacity: {opacity}%</p>
    </div>
  );
};

export default OpacityControl;
