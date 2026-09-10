interface TransformControlsProps {
  onRotate: () => void;
  onFlip: () => void;
  onScale: () => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({ onRotate, onFlip, onScale }) => {
  return (
    <div className="flex gap-1.5">
      <button
        onClick={onRotate}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white/90 transition hover:bg-white/15 active:scale-95"
        title="Rotate overlay 90°"
        aria-label="Rotate overlay"
      >
        ↻
      </button>
      <button
        onClick={onFlip}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white/90 transition hover:bg-white/15 active:scale-95"
        title="Flip overlay horizontal"
        aria-label="Flip overlay"
      >
        ⇋
      </button>
      <button
        onClick={onScale}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white/90 transition hover:bg-white/15 active:scale-95"
        title="Flip overlay vertical"
        aria-label="Flip overlay vertical"
      >
        ⤡
      </button>
    </div>
  );
};

export default TransformControls;
