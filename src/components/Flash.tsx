export type FlashMode = "off" | "auto" | "always";

interface FlashProps {
  value: FlashMode;
  open: boolean;
  onToggle: () => void;
  onChange: (mode: FlashMode) => void;
}

const FLASH_OPTIONS: { value: FlashMode; label: string; desc: string; icon: string }[] = [
  { value: "off", label: "Off", desc: "No flash", icon: "🚫" },
  { value: "auto", label: "Auto", desc: "Front glow on capture", icon: "⚡" },
  { value: "always", label: "On", desc: "Front glow always", icon: "🔆" },
];

const Flash: React.FC<FlashProps> = ({ value, open, onToggle, onChange }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Flash settings"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
          open || value !== "off"
            ? "border-white/40 bg-white/20 text-white"
            : "border-white/10 bg-white/10 text-white/80 hover:bg-white/15"
        }`}
      >
        {value === "off" ? "⚡" : value === "auto" ? "⚡" : "🔆"}
        {value !== "off" && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-black" />
        )}
      </button>

      {open && (
        <div className="animate-menuPop absolute left-0 top-12 z-50 w-[200px] rounded-2xl border border-white/10 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Flash
          </p>
          {FLASH_OPTIONS.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                  active ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-white">{opt.label}</span>
                  <span className="block truncate text-[11px] text-white/55">{opt.desc}</span>
                </span>
                {active && <span className="text-sm text-yellow-400">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Flash;
