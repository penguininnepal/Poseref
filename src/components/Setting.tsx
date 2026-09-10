interface SettingProps {
  open: boolean;
  onToggle: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  flashMode: string;
  timerValue: number;
  ratio: string;
  onResetCamera: () => void;
}

const Setting: React.FC<SettingProps> = ({
  open,
  onToggle,
  showGrid,
  onToggleGrid,
  flashMode,
  timerValue,
  ratio,
  onResetCamera,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Camera settings"
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
          open
            ? "border-white/40 bg-white/20 text-white"
            : "border-white/10 bg-white/10 text-white/80 hover:bg-white/15"
        }`}
      >
        ⚙
      </button>

      {open && (
        <div className="animate-menuPop absolute right-0 top-12 z-50 w-[240px] rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-2xl backdrop-blur-xl">
          <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
            Settings
          </p>

          <button
            onClick={onToggleGrid}
            className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 transition hover:bg-white/10"
          >
            <span className="text-left">
              <span className="block text-[13px] font-semibold text-white">Composition grid</span>
              <span className="block text-[11px] text-white/55">Rule-of-thirds overlay</span>
            </span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                showGrid ? "bg-yellow-400" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  showGrid ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          <div className="mt-2 rounded-xl bg-white/5 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Current setup</p>
            <p className="mt-1 text-[13px] text-white/85">
              Flash <span className="font-semibold text-white">{flashMode}</span> • Timer{" "}
              <span className="font-semibold text-white">
                {timerValue === 0 ? "off" : `${timerValue}s`}
              </span>{" "}
              • Ratio <span className="font-semibold text-white">{ratio}</span>
            </p>
          </div>

          <button
            onClick={onResetCamera}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-semibold text-white/85 transition hover:bg-white/10"
          >
            Reset camera defaults
          </button>
        </div>
      )}
    </div>
  );
};

export default Setting;
