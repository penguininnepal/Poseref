interface GridProps {
  enabled: boolean;
  onToggle: () => void;
}

const Grid: React.FC<GridProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Toggle grid"
      title={enabled ? "Hide grid" : "Show grid"}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
        enabled
          ? "border-white/40 bg-white/20 text-white"
          : "border-white/10 bg-white/10 text-white/80 hover:bg-white/15"
      }`}
    >
      ⊞
      {enabled && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-black" />
      )}
    </button>
  );
};

export default Grid;
