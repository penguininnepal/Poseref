import { useState } from "react";
import Top from "./Top";
import ViewScreen from "./ViewScreen";
import Bottom from "./Bottom";

interface MainSectionComponentProps {
  photos: string[];
  addPhoto: (photo: string) => void;
  onOpenGallery: () => void;
}

const MainSectionComponent: React.FC<MainSectionComponentProps> = ({ photos, addPhoto, onOpenGallery }) => {
  const [flashMode, setFlashMode] = useState<"off" | "auto" | "always">("off");
  const [ratio, setRatio] = useState("3/4");
  const [timerValue, setTimerValue] = useState<number>(0);
  const [cameraType, setCameraType] = useState<"user" | "environment">("user");

  const lastPhoto = photos[0] ?? null;

  return (
    <div className="flex h-full w-full flex-col">
      <Top
        flashMode={flashMode}
        setFlashMode={setFlashMode}
        ratio={ratio}
        setRatio={setRatio}
        timerValue={timerValue}
        setTimerValue={setTimerValue}
      />
      <ViewScreen
        flashMode={flashMode}
        ratio={ratio}
        timerValue={timerValue}
        cameraType={cameraType}
        setCameraType={setCameraType}
        onPhotoCaptured={addPhoto}
      />
      <Bottom
        onCapture={() => document.getElementById("hiddenCaptureTrigger")?.click()}
        lastPhoto={lastPhoto}
        onSwapCamera={(t) => setCameraType(t === "front" ? "user" : "environment")}
        onOpenGallery={onOpenGallery}
        photoCount={photos.length}
      />
    </div>
  );
};

export default MainSectionComponent;
