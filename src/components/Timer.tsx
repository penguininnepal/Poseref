interface TimerProps {
  onChange: (value: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onChange }) => {
  return (
    <div className="flex flex-col items-center text-white">
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">Timer</span>
      <select
        className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[11px] text-white outline-none"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="0" className="bg-neutral-900">Off</option>
        <option value="3" className="bg-neutral-900">3s</option>
        <option value="5" className="bg-neutral-900">5s</option>
        <option value="10" className="bg-neutral-900">10s</option>
      </select>
    </div>
  );
};

export default Timer;
