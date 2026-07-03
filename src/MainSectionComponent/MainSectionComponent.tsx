import { useState } from "react";
import Top from "./Top";
import ViewScreen from "./ViewScreen";
import Bottom from "./Bottom";

interface MainSectionComponentProps {
  photos: string[];
  addPhoto: (photo: string) => void;
  onOpenGallery: () => void;
}

interface Overlay {
  id: string;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  size: number;
}

const MainSectionComponent: React.FC<MainSectionComponentProps> = ({ photos, addPhoto, onOpenGallery }) => {
  const [flashMode, setFlashMode] = useState<"off" | "auto" | "always">("off");
  const [ratio, setRatio] = useState("3/4");
  const [timerValue, setTimerValue] = useState<number>(0);
  const [cameraType, setCameraType] = useState<"user" | "environment">("user");
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [overlayOpacity, setOverlayOpacity] = useState(100);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  const lastPhoto = photos[0] ?? null;

  const addOverlay = (src: string) => {
    const newOverlay: Overlay = {
      id: `overlay-${Date.now()}`,
      src,
      x: 50,
      y: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      size: 85,
    };
    setOverlays([...overlays, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
  };

  const updateOverlay = (id: string, updates: Partial<Overlay>) => {
    setOverlays(overlays.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };



  const rotateOverlay = () => {
    if (selectedOverlayId) {
      const overlay = overlays.find((o) => o.id === selectedOverlayId);
      if (overlay) {
        updateOverlay(selectedOverlayId, { rotation: (overlay.rotation + 90) % 360 });
      }
    }
  };

  const flipOverlay = () => {
    if (selectedOverlayId) {
      const overlay = overlays.find((o) => o.id === selectedOverlayId);
      if (overlay) {
        updateOverlay(selectedOverlayId, { scaleX: overlay.scaleX * -1 });
      }
    }
  };

  const scaleOverlay = () => {
    if (selectedOverlayId) {
      const overlay = overlays.find((o) => o.id === selectedOverlayId);
      if (overlay) {
        updateOverlay(selectedOverlayId, { scaleY: overlay.scaleY * -1 });
      }
    }
  };

  const increaseOverlaySize = () => {
    if (selectedOverlayId) {
      const overlay = overlays.find((o) => o.id === selectedOverlayId);
      if (overlay && overlay.size < 200) {
        updateOverlay(selectedOverlayId, { size: Math.min(overlay.size + 10, 200) });
      }
    }
  };

  const decreaseOverlaySize = () => {
    if (selectedOverlayId) {
      const overlay = overlays.find((o) => o.id === selectedOverlayId);
      if (overlay && overlay.size > 20) {
        updateOverlay(selectedOverlayId, { size: Math.max(overlay.size - 10, 20) });
      }
    }
  };

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
        onPhotoCaptured={addPhoto}
        overlays={showOverlay ? overlays : []}
        overlayOpacity={overlayOpacity}
        onUpdateOverlay={updateOverlay}
      />
      <Bottom
        onCapture={() => document.getElementById("hiddenCaptureTrigger")?.click()}
        lastPhoto={lastPhoto}
        onSwapCamera={(t) => setCameraType(t === "front" ? "user" : "environment")}
        onOpenGallery={onOpenGallery}
        photoCount={photos.length}
        setOverlayOpacity={setOverlayOpacity}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        onAddOverlay={addOverlay}
        onRotateOverlay={rotateOverlay}
        onFlipOverlay={flipOverlay}
        onScaleOverlay={scaleOverlay}
        onIncreaseSize={increaseOverlaySize}
        onDecreaseSize={decreaseOverlaySize}
      />
    </div>
  );
};

export default MainSectionComponent;
