import { useState } from "react";
import { Link } from "react-router-dom";
import ImageViewer from "./components/ImageViewer";

interface GalleryPageProps {
  photos: string[];
  onDelete: (index: number) => void;
}

interface SelectedPhoto {
  index: number;
  src: string;
}

const GalleryPage = ({ photos, onDelete }: GalleryPageProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedPhoto | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<number[]>([]);

  const toggleLike = (index: number) => {
    setLikedPhotos((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
    );
  };

  const handleDelete = (index: number) => {
    onDelete(index);
    setSelectedPhoto(null);
    setLikedPhotos((current) => current.filter((item) => item !== index));
  };

  const downloadPhoto = async (src: string, index: number) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `capture-${index + 1}${blob.type.includes("jpeg") ? ".jpg" : ".png"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      const fallbackLink = document.createElement("a");
      fallbackLink.href = src;
      fallbackLink.download = `capture-${index + 1}.png`;
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
          {photos.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📸</div>
                <p className="text-white/60 text-sm">No photos yet</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
            {photos.map((photo, index) => {
              const isLiked = likedPhotos.includes(index);
              return (
                <button
                  key={`${photo}-${index}`}
                  onClick={() => setSelectedPhoto({ index, src: photo })}
                  className="group relative overflow-hidden rounded-md bg-white/5 aspect-square hover:opacity-80 transition"
                >
                  <img
                    src={photo}
                    alt={`Capture ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
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
      {selectedPhoto ? (
        <ImageViewer
          src={selectedPhoto.src}
          index={selectedPhoto.index}
          totalPhotos={photos.length}
          isLiked={likedPhotos.includes(selectedPhoto.index)}
          onLike={() => toggleLike(selectedPhoto.index)}
          onDelete={() => handleDelete(selectedPhoto.index)}
          onClose={() => setSelectedPhoto(null)}
          onDownload={() => downloadPhoto(selectedPhoto.src, selectedPhoto.index)}
        />
      ) : null}
    </div>
  );
};

export default GalleryPage;
