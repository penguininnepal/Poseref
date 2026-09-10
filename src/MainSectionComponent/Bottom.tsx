import { useState } from "react";
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
  overlayOpacity: number;
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
  overlayOpacity,
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
  const [poseToolsOpen, setPoseToolsOpen] = useState(true);

  return (
    <div className="bg-black px-3 pb-4 pt-2">
      {/* Pose reference tools — collapsible standard section */}
      <div className="mb-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <button
          onClick={() => setPoseToolsOpen((v) => !v)}
          aria-expanded={poseToolsOpen}
          className="flex w-full items-center justify-between px-3 py-2"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
            Pose reference
          </span>
          <span className="text-xs text-white/55">{poseToolsOpen ? "▾" : "▸"}</span>
        </button>

        {poseToolsOpen && (
          <div className="space-y-2.5 px-3 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                aria-pressed={showOverlay}
                title={showOverlay ? "Hide overlay" : "Show overlay"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition active:scale-95 ${
                  showOverlay
                    ? "border-white/25 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-white/50"
                }`}
              >
                {showOverlay ? "👁" : "🚫"}
              </button>
              <div className="min-w-0 flex-1">
                <OpacityControl value={overlayOpacity} onChange={setOverlayOpacity} />
              </div>
              <OverlayManager onAddOverlay={onAddOverlay} />
            </div>

            <div className="flex items-center justify-between gap-2">
              <TransformControls
                onRotate={onRotateOverlay}
                onFlip={onFlipOverlay}
                onScale={onScaleOverlay}
              />
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={onDecreaseSize}
                  aria-label="Decrease overlay size"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg leading-none text-white/90 transition hover:bg-white/15 active:scale-95"
                >
                  −
                </button>
                <button
                  onClick={onIncreaseSize}
                  aria-label="Increase overlay size"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg leading-none text-white/90 transition hover:bg-white/15 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Standard shutter row: thumbnail | shutter | flip */}
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <button
          onClick={onOpenGallery}
          aria-label="Open gallery"
          className="rounded-xl transition hover:bg-white/10 active:scale-95"
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
