import { useState } from "react";
import OpacityControl from "../components/OpacityControl";
import OverlayManager from "../components/OverlayManager";
import TransformControls from "../components/TransformControls";
import PreviewThumbnail from "../components/PreviewThumbnail";
import CaptureButton from "../components/CaptureButton";
import RecordButton from "../components/RecordButton";
import SwapCamera from "../components/SwapCamera";
import type { CameraMode, MediaItem } from "../lib/camera";

interface BottomProps {
  onCapture: () => void;
  lastMedia: MediaItem | null;
  onSwapCamera: (type: "front" | "back") => void;
  onOpenGallery: () => void;
  photoCount: number;
  canCapture?: boolean;
  mode: CameraMode;
  onModeChange: (mode: CameraMode) => void;
  recording: boolean;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
  onAddOverlay: (src: string) => void;
  overlayCount: number;
  onRemoveOverlay: () => void;
  onRotateOverlay: () => void;
  onFlipOverlay: () => void;
  onScaleOverlay: () => void;
  onIncreaseSize: () => void;
  onDecreaseSize: () => void;
}

const Bottom: React.FC<BottomProps> = ({
  onCapture,
  lastMedia,
  onSwapCamera,
  onOpenGallery,
  photoCount,
  canCapture = true,
  mode,
  onModeChange,
  recording,
  overlayOpacity,
  setOverlayOpacity,
  showOverlay,
  setShowOverlay,
  onAddOverlay,
  overlayCount,
  onRemoveOverlay,
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
            {overlayCount > 0 && (
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] tabular-nums text-white/80">
                {overlayCount}
              </span>
            )}
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
              <button
                onClick={onRemoveOverlay}
                disabled={overlayCount === 0}
                aria-label="Remove pose reference overlay"
                title={
                  overlayCount === 0
                    ? "No overlay to remove"
                    : "Remove the current overlay"
                }
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base transition active:scale-95 ${
                  overlayCount === 0
                    ? "border-white/5 bg-white/[0.03] text-white/25"
                    : "border-red-400/25 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                }`}
              >
                🗑
              </button>
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

      {/* Native-style PHOTO / VIDEO mode selector */}
      <div className="flex justify-center pb-1">
        <div
          role="tablist"
          aria-label="Camera mode"
          className="flex items-center gap-1 rounded-full bg-white/5 p-1"
        >
          {(["photo", "video"] as CameraMode[]).map((option) => {
            const active = mode === option;
            return (
              <button
                key={option}
                role="tab"
                aria-selected={active}
                disabled={recording}
                onClick={() => onModeChange(option)}
                className={`rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                  active
                    ? "bg-white/15 text-yellow-400"
                    : "text-white/50 hover:text-white/80"
                } ${recording ? "opacity-40" : ""}`}
              >
                {option === "photo" ? "Photo" : "Video"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Standard shutter row: thumbnail | shutter | flip */}
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <button
          onClick={onOpenGallery}
          aria-label="Open gallery"
          className="rounded-xl transition hover:bg-white/10 active:scale-95"
        >
          <PreviewThumbnail media={lastMedia} count={photoCount} />
        </button>
        {mode === "photo" ? (
          <CaptureButton onClick={onCapture} disabled={!canCapture} />
        ) : (
          <RecordButton recording={recording} disabled={!canCapture} onToggle={onCapture} />
        )}
        <SwapCamera onSwap={onSwapCamera} disabled={recording} />
      </div>
    </div>
  );
};

export default Bottom;
