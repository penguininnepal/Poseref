import { useEffect, useState } from "react";
import Top from "./Top";
import ViewScreen from "./ViewScreen";
import Bottom from "./Bottom";
import {
  loadSettings,
  saveSettings,
  type CameraMode,
  type MediaItem,
} from "../lib/camera";

interface MainSectionComponentProps {
  media: MediaItem[];
  addPhoto: (photo: string) => void;
  addVideo: (src: string, duration: number, poster: string) => void;
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

const MainSectionComponent: React.FC<MainSectionComponentProps> = ({
  media,
  addPhoto,
  addVideo,
  onOpenGallery,
}) => {
  // Settings persist across sessions, like a real camera app.
  const [initial] = useState(loadSettings);
  const [flashMode, setFlashMode] = useState<"off" | "auto" | "always">(initial.flashMode);
  const [ratio, setRatio] = useState(initial.ratio);
  const [timerValue, setTimerValue] = useState<number>(initial.timerValue);
  const [cameraType, setCameraType] = useState<"user" | "environment">(initial.cameraType);
  const [showGrid, setShowGrid] = useState(initial.showGrid);
  const [mode, setMode] = useState<CameraMode>("photo");
  const [recording, setRecording] = useState(false);
  const [canCapture, setCanCapture] = useState(false);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [overlayOpacity, setOverlayOpacity] = useState(100);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);

  useEffect(() => {
    saveSettings({ flashMode, ratio, timerValue, showGrid, cameraType });
  }, [flashMode, ratio, timerValue, showGrid, cameraType]);

  const lastMedia = media[0] ?? null;

  const addOverlay = (src: string) => {
    // Single pose reference at a time: picking a new overlay automatically
    // replaces the previous one, so ghosts never pile up.
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
    setOverlays([newOverlay]);
    setSelectedOverlayId(newOverlay.id);
  };

  const removeActiveOverlay = () => {
    setOverlays((current) => {
      if (current.length === 0) return current;
      const targetId = selectedOverlayId ?? current[current.length - 1].id;
      return current.filter((o) => o.id !== targetId);
    });
    setSelectedOverlayId(null);
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
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        cameraType={cameraType}
      />
      <ViewScreen
        flashMode={flashMode}
        ratio={ratio}
        timerValue={timerValue}
        cameraType={cameraType}
        mode={mode}
        onPhotoCaptured={addPhoto}
        onVideoCaptured={addVideo}
        overlays={showOverlay ? overlays : []}
        overlayOpacity={overlayOpacity}
        onUpdateOverlay={updateOverlay}
        showGrid={showGrid}
        onReadyChange={setCanCapture}
        onRecordingChange={setRecording}
      />
      <Bottom
        onCapture={() => document.getElementById("hiddenCaptureTrigger")?.click()}
        lastMedia={lastMedia}
        onSwapCamera={(t) => setCameraType(t === "front" ? "user" : "environment")}
        onOpenGallery={onOpenGallery}
        photoCount={media.length}
        canCapture={canCapture}
        mode={mode}
        onModeChange={setMode}
        recording={recording}
        overlayOpacity={overlayOpacity}
        setOverlayOpacity={setOverlayOpacity}
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        onAddOverlay={addOverlay}
        overlayCount={overlays.length}
        onRemoveOverlay={removeActiveOverlay}
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
