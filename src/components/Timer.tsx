interface TimerProps {
  onChange: (value: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onChange }) => {
  return (
    <div className="flex flex-col items-center text-white text-xs">
      <span className="mb-1">Timer</span>
      <select
        className="bg-gray-700 text-white rounded px-2 py-1"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="0">Off</option>
        <option value="3">3s</option>
        <option value="5">5s</option>
        <option value="10">10s</option>
      </select>
    </div>
  );
};

export default Timer;
