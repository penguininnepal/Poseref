import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Camera from "./Camera";
import GalleryPage from "./GalleryPage";

const App = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhoto = (photo: string) => {
    console.log("Captured photo added", photo);
    setPhotos((current) => [photo, ...current]);
  };

  const deletePhoto = (index: number) => {
    console.log("Delete photo at index", index);
    setPhotos((current) => current.filter((_, i) => i !== index));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-transparent text-white">
        <div className="mx-auto flex min-h-screen items-center justify-center px-3 py-3 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Camera photos={photos} addPhoto={addPhoto} />} />
            <Route path="/gallery" element={<GalleryPage photos={photos} onDelete={deletePhoto} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
