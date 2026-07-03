interface TransformControlsProps {
  onRotate: () => void;
  onFlip: () => void;
  onScale: () => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({ onRotate, onFlip, onScale }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onRotate}
        className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
        title="Rotate overlay"
      >
        ↻
      </button>
      <button
        onClick={onFlip}
        className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
        title="Flip overlay"
      >
        ⇋
      </button>
      <button
        onClick={onScale}
        className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
        title="Scale overlay"
      >
        ⤡
      </button>
    </div>
  );
};

export default TransformControls;
