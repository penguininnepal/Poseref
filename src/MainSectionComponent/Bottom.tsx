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
}

const Bottom: React.FC<BottomProps> = ({ onCapture, lastPhoto, onSwapCamera, onOpenGallery, photoCount }) => {
  return (
    <div className="bg-black/80 px-4 pb-4 pt-3 backdrop-blur-xl">
      <div className="mb-4 rounded-[32px] border border-white/10 bg-white/5 p-3 shadow-[0_15px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90">
              ☀
            </div>
            <OpacityControl onChange={(v) => console.log("Opacity changed to", v)} />
          </div>
          <button
            onClick={onOpenGallery}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl text-white transition hover:bg-white/15"
          >
            👁
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <OverlayManager />
          <TransformControls
            onRotate={() => console.log("Rotate action triggered")}
            onFlip={() => console.log("Flip action triggered")}
            onScale={() => console.log("Scale action triggered")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button onClick={onOpenGallery} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 transition hover:bg-white/10">
          <PreviewThumbnail photo={lastPhoto} count={photoCount} />
        </button>
        <CaptureButton onClick={onCapture} />
        <SwapCamera onSwap={onSwapCamera} />
      </div>
    </div>
  );
};

export default Bottom;
