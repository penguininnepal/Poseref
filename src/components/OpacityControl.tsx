const OpacityControl = ({
  onChange,
  value = 100,
}: {
  onChange: (value: number) => void;
  value?: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseInt(e.target.value, 10);
    console.log("Opacity change triggered:", next);
    onChange(next);
  };

  return (
    <div className="flex w-full items-center gap-2.5">
      <span className="text-[11px] font-semibold tabular-nums text-white/60">{value}%</span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="camera-range w-full"
        aria-label="Overlay opacity"
      />
    </div>
  );
};

export default OpacityControl;
