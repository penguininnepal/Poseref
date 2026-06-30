interface PreviewThumbnailProps {
  photo: string | null;
}

const PreviewThumbnail: React.FC<PreviewThumbnailProps> = ({ photo }) => {
  return (
    <div className="bg-gray-600 h-14 w-14 rounded-lg overflow-hidden flex items-center justify-center text-white text-xs">
      {photo ? (
        <img src={photo} alt="Last capture" className="w-full h-full object-cover" />
      ) : (
        "Img"
      )}
    </div>
  );
};

export default PreviewThumbnail;
