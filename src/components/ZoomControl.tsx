interface ZoomProps {
  zoom: number;
  onChange: (value: number) => void;
}

const ZoomControl: React.FC<ZoomProps> = ({ zoom, onChange }) => {
  const options = [0.5, 1, 3];

  return (
    <div className="flex gap-2 rounded-full border border-white/10 bg-black/45 px-2 py-2 text-white shadow-lg backdrop-blur-md">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-3 py-1 text-sm transition ${zoom === opt ? "bg-white text-black" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
        >
          {opt}x
        </button>
      ))}
    </div>
  );
};

export default ZoomControl;
