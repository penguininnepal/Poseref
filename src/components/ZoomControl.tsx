interface ZoomProps {
  zoom: number;
  onChange: (value: number) => void;
}

const ZoomControl: React.FC<ZoomProps> = ({ zoom, onChange }) => {
  const options = [0.5, 1, 3];

  return (
    <div className="bg-black/40 text-white rounded-lg px-4 py-2 flex gap-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2 py-1 rounded ${zoom === opt ? "bg-white text-black" : ""}`}
        >
          {opt}X
        </button>
      ))}
    </div>
  );
};

export default ZoomControl;
