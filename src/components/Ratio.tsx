import { useState } from "react";

const ratios = [
  { label: "1:1", value: "1/1" },
  { label: "3:4", value: "3/4" },
  { label: "9:16", value: "9/16" },
  { label: "Full", value: "full" }, // ✅ portrait full
];

interface RatioProps {
  onChange?: (ratio: string) => void;
}

const Ratio: React.FC<RatioProps> = ({ onChange }) => {
  const [selected, setSelected] = useState("3/4");

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex flex-col items-center text-white text-xs">
      <span className="mb-1">Ratio</span>
      <select
        value={selected}
        onChange={(e) => handleSelect(e.target.value)}
        className="bg-gray-700 text-white rounded px-2 py-1"
      >
        {ratios.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Ratio;
