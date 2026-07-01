const CaptureButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-white via-white to-neutral-300 shadow-[0_15px_40px_rgba(255,255,255,0.2)] transition active:scale-95"
    >
      <div className="absolute inset-[6px] rounded-full border border-white/40" />
      <div className="h-12 w-12 rounded-full bg-neutral-900 shadow-inner transition group-active:scale-95" />
      <div className="absolute inset-0 rounded-full border-[5px] border-neutral-900/70" />
    </button>
  );
};

export default CaptureButton;
