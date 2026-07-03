import { useState } from "react";

interface ImageViewerProps {
  src: string;
  index: number;
  totalPhotos: number;
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
  onClose: () => void;
  onDownload: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
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
    const today = new Date();
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
    const month = months[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");

    return {
      date: `${month} ${day}, ${year}`,
      time: `${hours}:${minutes}`,
    };
  };

  const { date, time } = getFormattedDate();

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `photo-${index + 1}${blob.type.includes("jpeg") ? ".jpg" : ".png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = src;
      fallbackLink.download = `photo-${index + 1}.png`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

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
          <p className="text-white/60 text-xs">{time}</p>
        </div>
        <div className="w-6" />
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-3 py-3 bg-black">
        <img
          src={src}
          alt="Selected"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-white/10 px-4 py-5 flex items-center justify-center gap-12 bg-black/50 backdrop-blur-sm">
        <button
          onClick={handleDownload}
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
    </div>
  );
};

export default ImageViewer;
