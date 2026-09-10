interface PreviewThumbnailProps {
  photo: string | null;
  count?: number;
}

const PreviewThumbnail: React.FC<PreviewThumbnailProps> = ({ photo, count = 0 }) => {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
      {photo ? (
        <img src={photo} alt="Last capture" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
          🖼
        </div>
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
