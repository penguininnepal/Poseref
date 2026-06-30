import { useState } from "react";

const ratios = [
  { label: "Instagram Square", value: "1/1" },
  { label: "Instagram Portrait", value: "4/5" },
  { label: "Landscape", value: "16/9" },
  { label: "TikTok Vertical", value: "9/16" },
  { label: "Pinterest Pin", value: "2/3" },
];

interface RatioProps {
  onChange?: (ratio: string) => void;
}

const Ratio: React.FC<RatioProps> = ({ onChange }) => {
  const [selected, setSelected] = useState("1/1");

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
