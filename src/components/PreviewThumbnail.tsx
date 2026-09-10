import type { MediaItem } from "../lib/camera";

interface PreviewThumbnailProps {
  media: MediaItem | null;
  count?: number;
}

const PreviewThumbnail: React.FC<PreviewThumbnailProps> = ({ media, count = 0 }) => {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
      {!media ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
          🖼
        </div>
      ) : media.kind === "video" ? (
        <>
          {media.poster ? (
            <img src={media.poster} alt="Last recording" className="h-full w-full object-cover" />
          ) : (
            <video src={media.src} muted playsInline preload="metadata" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-sm text-white">▶</span>
          </div>
        </>
      ) : (
        <img src={media.src} alt="Last capture" className="h-full w-full object-cover" />
      )}
      {count > 0 && (
        <div className="absolute bottom-0 right-0 rounded-tl-lg bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white backdrop-blur-sm">
          {count}
        </div>
      )}
    </div>
  );
};

export default PreviewThumbnail;
