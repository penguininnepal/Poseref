import { useState } from "react";
import { Link } from "react-router-dom";
import MediaViewer from "./components/MediaViewer";
import { formatDuration, type MediaItem } from "./lib/camera";

interface GalleryPageProps {
  media: MediaItem[];
  onDelete: (index: number) => void;
}

interface SelectedMedia {
  index: number;
  item: MediaItem;
}

const GalleryPage = ({ media, onDelete }: GalleryPageProps) => {
  const [selected, setSelected] = useState<SelectedMedia | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleDelete = (index: number) => {
    onDelete(index);
    setSelected(null);
    setLikedIds((current) => current.filter((id) => id !== media[index]?.id));
  };

  const downloadMedia = async (item: MediaItem, index: number) => {
    const isVideo = item.kind === "video";
    try {
      const response = await fetch(item.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      let ext = isVideo ? ".mp4" : ".png";
      if (blob.type.includes("webm")) ext = ".webm";
      else if (blob.type.includes("mp4")) ext = ".mp4";
      else if (blob.type.includes("jpeg") || blob.type.includes("jpg")) ext = ".jpg";
      link.href = url;
      link.download = `${isVideo ? "video" : "capture"}-${index + 1}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = item.src;
      fallbackLink.download = `${isVideo ? "video" : "capture"}-${index + 1}${isVideo ? ".mp4" : ".png"}`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  return (
    <div className="relative h-[92vh] min-h-[760px] w-full max-w-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
      <div className="flex h-full flex-col bg-black text-white">
        {/* Header */}
        <div className="border-b border-white/10 px-4 py-5">
          <h1 className="text-4xl font-bold mb-4">Photos</h1>
          <div className="flex gap-4 text-sm">
            <Link
              to="/"
              className="text-white/60 hover:text-white transition font-medium"
            >
              Today
            </Link>
            <span className="text-white/40">|</span>
            <button className="text-white font-medium">Gallery</button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
          {media.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📸</div>
                <p className="text-white/60 text-sm">No photos yet</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
            {media.map((item, index) => {
              const isLiked = likedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected({ index, item })}
                  className="group relative overflow-hidden rounded-md bg-white/5 aspect-square hover:opacity-80 transition"
                >
                  {item.kind === "video" ? (
                    <>
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={`Recording ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.src}
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white">
                          ▶
                        </span>
                      </div>
                      {typeof item.duration === "number" && (
                        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] font-semibold tabular-nums text-white">
                          {formatDuration(item.duration)}
                        </div>
                      )}
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={`Capture ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {isLiked && (
                    <div className="absolute top-1 right-1 text-lg text-rose-500">
                      ♥
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          )}
        </div>

        {/* Back to Camera Button */}
        <div className="border-t border-white/10 px-4 py-3">
          <Link
            to="/"
            className="w-full block text-center rounded-lg bg-white/10 hover:bg-white/20 transition py-2 text-sm font-medium"
          >
            Back to Camera
          </Link>
        </div>
      </div>

      {/* Preview Modal */}
      {selected ? (
        <MediaViewer
          item={selected.item}
          index={selected.index}
          totalPhotos={media.length}
          isLiked={likedIds.includes(selected.item.id)}
          onLike={() => toggleLike(selected.item.id)}
          onDelete={() => handleDelete(selected.index)}
          onClose={() => setSelected(null)}
          onDownload={() => downloadMedia(selected.item, selected.index)}
        />
      ) : null}
    </div>
  );
};

export default GalleryPage;
