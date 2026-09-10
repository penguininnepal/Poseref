import { useState } from "react";
import type { MediaItem } from "../lib/camera";

interface MediaViewerProps {
  item: MediaItem;
  index: number;
  totalPhotos: number;
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
  onClose: () => void;
  onDownload: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  item,
  index,
  totalPhotos,
  isLiked,
  onLike,
  onDelete,
  onClose,
  onDownload,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const getFormattedDate = () => {
    const source = item.createdAt > 0 ? new Date(item.createdAt) : new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[source.getMonth()];
    const day = source.getDate();
    const year = source.getFullYear();
    const hours = String(source.getHours()).padStart(2, "0");
    const minutes = String(source.getMinutes()).padStart(2, "0");

    return {
      date: `${month} ${day}, ${year}`,
      time: `${hours}:${minutes}`,
    };
  };

  const { date, time } = getFormattedDate();

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition text-2xl"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-white font-semibold">{date}</p>
          <p className="text-white/60 text-xs">
            {time} • {index + 1} / {totalPhotos}
          </p>
        </div>
        <div className="w-6" />
      </div>

      {/* Media Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-3 py-3 bg-black">
        {item.kind === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            src={item.src}
            alt="Selected"
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-white/10 px-4 py-5 flex items-center justify-center gap-12 bg-black/50 backdrop-blur-sm">
        <button
          onClick={onDownload}
          className="text-white/70 hover:text-white transition text-3xl"
          aria-label="Download"
        >
          ⬇
        </button>

        <button
          className="text-white/70 hover:text-white transition text-3xl"
          aria-label="Edit"
        >
          ✏️
        </button>

        <button
          onClick={onLike}
          className={`transition text-3xl ${
            isLiked ? "text-rose-500" : "text-white/70 hover:text-white"
          }`}
          aria-label="Like"
        >
          {isLiked ? "♥" : "♡"}
        </button>

        <button
          onClick={onDelete}
          className="text-white/70 hover:text-rose-500 transition text-3xl"
          aria-label="Delete"
        >
          🗑
        </button>

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="text-white/70 hover:text-white transition text-3xl"
          aria-label="More options"
        >
          ⋯
        </button>
      </div>

      {showMoreMenu && (
        <div className="border-t border-white/10 px-4 py-3 text-center text-xs text-white/50">
          {item.kind === "video" ? "Video" : "Photo"} {index + 1} of {totalPhotos}
          {item.kind === "video" ? " • recorded in Poseref" : " • captured in Poseref"}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;
