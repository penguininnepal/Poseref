import OpacityControl from "../components/OpacityControl";
import OverlayManager from "../components/OverlayManager";
import TransformControls from "../components/TransformControls";
import PreviewThumbnail from "../components/PreviewThumbnail";
import CaptureButton from "../components/CaptureButton";
import SwapCamera from "../components/SwapCamera";

interface BottomProps {
  onCapture: () => void;
  lastPhoto: string | null;
  onSwapCamera: (type: "front" | "back") => void;
  onOpenGallery: () => void;
  photoCount: number;
  setOverlayOpacity: (opacity: number) => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
  onAddOverlay: (src: string) => void;
  onRotateOverlay: () => void;
  onFlipOverlay: () => void;
  onScaleOverlay: () => void;
  onIncreaseSize: () => void;
  onDecreaseSize: () => void;
}

const Bottom: React.FC<BottomProps> = ({
  onCapture,
  lastPhoto,
  onSwapCamera,
  onOpenGallery,
  photoCount,
  setOverlayOpacity,
  showOverlay,
  setShowOverlay,
  onAddOverlay,
  onRotateOverlay,
  onFlipOverlay,
  onScaleOverlay,
  onIncreaseSize,
  onDecreaseSize,
}) => {
  return (
    <div className="bg-black/80 px-4 pb-4 pt-3 backdrop-blur-xl">
      <div className="mb-4 rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-[0_15px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/60 px-3 py-2">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90 transition hover:bg-white/15 text-lg"
              title={showOverlay ? "Hide overlay" : "Show overlay"}
            >
              {showOverlay ? "👁" : "🚫"}
            </button>
            <OpacityControl onChange={(v) => setOverlayOpacity(v)} />
          </div>
          <OverlayManager onAddOverlay={onAddOverlay} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <TransformControls
            onRotate={onRotateOverlay}
            onFlip={onFlipOverlay}
            onScale={onScaleOverlay}
          />
          <div className="flex gap-2">
            <button
              onClick={onDecreaseSize}
              className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
              title="Decrease overlay size"
            >
              −
            </button>
            <button
              onClick={onIncreaseSize}
              className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-2xl text-white/90 transition hover:bg-white/15"
              title="Increase overlay size"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onOpenGallery}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 transition hover:bg-white/10"
        >
          <PreviewThumbnail photo={lastPhoto} count={photoCount} />
        </button>
        <CaptureButton onClick={onCapture} />
        <SwapCamera onSwap={onSwapCamera} />
      </div>
    </div>
  );
};

export default Bottom;
