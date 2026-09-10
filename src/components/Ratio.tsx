interface RatioProps {
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (ratio: string) => void;
}

const RATIOS = [
  { label: "1:1", value: "1/1", desc: "Square" },
  { label: "3:4", value: "3/4", desc: "Standard" },
  { label: "9:16", value: "9/16", desc: "Portrait" },
  { label: "Full", value: "full", desc: "Full screen" },
];

const Ratio: React.FC<RatioProps> = ({ value, open, onToggle, onChange }) => {
  const active = RATIOS.find((r) => r.value === value);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Aspect ratio"
        className={`flex h-10 min-w-[52px] items-center justify-center gap-1 rounded-full border px-2.5 text-[12px] font-semibold transition ${
          open
            ? "border-white/40 bg-white/20 text-white"
            : "border-white/10 bg-white/10 text-white/80 hover:bg-white/15"
        }`}
      >
        <span className="text-sm">🖼</span>
        {active?.label ?? "3:4"}
      </button>

      {open && (
        <div className="animate-menuPop absolute left-0 top-12 z-50 w-[200px] rounded-2xl border border-white/10 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Aspect ratio
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {RATIOS.map((r) => {
              const isActive = value === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => onChange(r.value)}
                  className={`rounded-xl border px-2 py-2 text-center transition ${
                    isActive
                      ? "border-yellow-400/60 bg-yellow-400/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="block text-[13px] font-bold text-white">{r.label}</span>
                  <span className="block text-[10px] text-white/55">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ratio;
