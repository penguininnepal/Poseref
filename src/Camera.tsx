import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainSectionComponent from "./MainSectionComponent/MainSectionComponent";

interface CameraProps {
  photos: string[];
  addPhoto: (photo: string) => void;
}

const Camera: React.FC<CameraProps> = ({ photos, addPhoto }) => {
  const navigate = useNavigate();

  const onOpenGallery = useCallback(() => {
    console.log("Preview gallery opened");
    navigate("/gallery");
  }, [navigate]);

  return (
    <div className="h-[92vh] min-h-[760px] w-full max-w-[430px] overflow-hidden rounded-[32px] border border-white/10 bg-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
      <MainSectionComponent photos={photos} addPhoto={addPhoto} onOpenGallery={onOpenGallery} />
    </div>
  );
};

export default Camera;
