const RecordButton = ({
  recording,
  disabled = false,
  onToggle,
}: {
  recording: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-label={recording ? "Stop recording" : "Start recording"}
      className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[3px] transition active:scale-95 ${
        disabled ? "border-white/25 opacity-50" : "border-white"
      }`}
    >
      {recording ? (
        <span className="block h-[32px] w-[32px] rounded-[8px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)]" />
      ) : (
        <span className="block h-[60px] w-[60px] rounded-full bg-red-500 transition group-active:scale-90" />
      )}
    </button>
  );
};

export default RecordButton;
