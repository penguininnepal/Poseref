import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Camera from "./Camera";
import GalleryPage from "./GalleryPage";
import { loadPersistedPhotos, newMediaId, persistPhotos, type MediaItem } from "./lib/camera";

const App = () => {
  const [media, setMedia] = useState<MediaItem[]>(() => loadPersistedPhotos());

  const addPhoto = (photo: string) => {
    console.log("Captured photo added");
    setMedia((current) => [
      { id: newMediaId(), kind: "photo", src: photo, createdAt: Date.now() },
      ...current,
    ]);
  };

  const addVideo = (src: string, duration: number, poster: string) => {
    console.log("Captured video added");
    setMedia((current) => [
      { id: newMediaId(), kind: "video", src, duration, poster, createdAt: Date.now() },
      ...current,
    ]);
  };

  const deleteMedia = (index: number) => {
    console.log("Delete media at index", index);
    setMedia((current) => {
      const target = current[index];
      // Release object URLs for session-only videos.
      if (target?.kind === "video" && target.src.startsWith("blob:")) {
        URL.revokeObjectURL(target.src);
      }
      return current.filter((_, i) => i !== index);
    });
  };

  // Persist photos (downscaled) so the gallery survives reloads.
  useEffect(() => {
    persistPhotos(media);
  }, [media]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent text-white">
        <div className="mx-auto flex min-h-screen items-center justify-center px-3 py-3 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Camera media={media} addPhoto={addPhoto} addVideo={addVideo} />} />
            <Route path="/gallery" element={<GalleryPage media={media} onDelete={deleteMedia} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
