interface TimerProps {
  value: number;
  open: boolean;
  onToggle: () => void;
  onChange: (value: number) => void;
}

const OPTIONS = [
  { label: "Off", value: 0 },
  { label: "3s", value: 3 },
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
];

const Timer: React.FC<TimerProps> = ({ value, open, onToggle, onChange }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Self timer"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
          open || value > 0
            ? "border-white/40 bg-white/20 text-white"
            : "border-white/10 bg-white/10 text-white/80 hover:bg-white/15"
        }`}
      >
        ⏱
        {value > 0 && (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-yellow-400 px-1 text-[9px] font-bold leading-4 text-black ring-2 ring-black">
            {value}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-menuPop absolute right-0 top-12 z-50 w-[180px] rounded-2xl border border-white/10 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
          <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Timer
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {OPTIONS.map((o) => {
              const isActive = value === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => onChange(o.value)}
                  className={`rounded-xl border px-2 py-2 text-[13px] font-semibold transition ${
                    isActive
                      ? "border-yellow-400/60 bg-yellow-400/15 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
