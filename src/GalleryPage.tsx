import { Link } from "react-router-dom";

interface GalleryPageProps {
  photos: string[];
  onDelete: (index: number) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ photos, onDelete }) => {
  return (
    <div className="min-h-screen bg-black px-4 py-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Captured Gallery</h1>
          <p className="text-sm text-white/60">All saved captures appear here.</p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {photos.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/70">
            No images yet. Capture one to see it here.
          </div>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg">
              <img src={photo} alt={`Capture ${index + 1}`} className="h-72 w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-3 py-2 text-sm text-white backdrop-blur-sm">
                <span>Image {index + 1}</span>
                <button
                  onClick={() => onDelete(index)}
                  className="rounded-2xl bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
