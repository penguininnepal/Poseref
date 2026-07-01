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
    <div className="flex flex-col items-center text-white">
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Ratio</span>
      <select
        value={selected}
        onChange={(e) => handleSelect(e.target.value)}
        className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[11px] text-white outline-none"
      >
        {ratios.map((r) => (
          <option key={r.value} value={r.value} className="bg-neutral-900 text-white">
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Ratio;
