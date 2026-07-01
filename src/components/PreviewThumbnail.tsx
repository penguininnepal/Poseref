interface PreviewThumbnailProps {
  photo: string | null;
  count?: number;
}

const PreviewThumbnail: React.FC<PreviewThumbnailProps> = ({ photo, count = 0 }) => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-inner">
      {photo ? (
        <img src={photo} alt="Last capture" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Gallery
        </div>
      )}
      {count > 0 && (
        <div className="absolute -right-2 -top-2 flex h-7 min-w-[1.7rem] items-center justify-center rounded-full bg-yellow-400 px-1.5 text-[10px] font-semibold text-black shadow-lg">
          {count}
        </div>
      )}
    </div>
  );
};

export default PreviewThumbnail;
