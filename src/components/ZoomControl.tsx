interface ZoomProps {
  zoom: number;
  onChange: (value: number) => void;
}

const ZoomControl: React.FC<ZoomProps> = ({ zoom, onChange }) => {
  const options = [0.5, 1, 3];

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-1.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md">
      {options.map((opt) => {
        const active = zoom === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`min-w-[52px] rounded-full px-3 py-1.5 text-[13px] font-semibold tabular-nums transition ${
              active
                ? "bg-white text-black shadow"
                : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
            }`}
          >
            {opt}x
          </button>
        );
      })}
    </div>
  );
};

export default ZoomControl;
