import { useState, useRef, useEffect } from "react";
import ZoomControl from "../components/ZoomControl";

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

interface ViewScreenProps {
  flashMode: "off" | "auto" | "always";
  ratio: string;
  timerValue: number;
  cameraType: "user" | "environment";
  onPhotoCaptured: (photo: string) => void;
  overlays?: Overlay[];
  overlayOpacity?: number;
  onUpdateOverlay?: (id: string, updates: Partial<Overlay>) => void;
  showGrid?: boolean;
}

const ViewScreen: React.FC<ViewScreenProps> = ({
  flashMode,
  ratio,
  timerValue,
  cameraType,
  onPhotoCaptured,
  overlays = [],
  overlayOpacity = 100,
  onUpdateOverlay,
  showGrid = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showFrontGlow, setShowFrontGlow] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [draggingOverlayId, setDraggingOverlayId] = useState<string | null>(null);
  const [pinchDistance, setPinchDistance] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const getPinchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch0 = touches[0];
    const touch1 = touches[1];
    const dx = touch0.clientX - touch1.clientX;
    const dy = touch0.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent, overlayId: string) => {
    if (e.touches.length === 1) {
      setDraggingOverlayId(overlayId);
    } else if (e.touches.length === 2) {
      setPinchDistance(getPinchDistance(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent, overlayId: string) => {
    if (!screenRef.current || !onUpdateOverlay) return;

    const overlay = overlays.find((o) => o.id === overlayId);
    if (!overlay) return;

    const rect = screenRef.current.getBoundingClientRect();

    if (e.touches.length === 1 && draggingOverlayId === overlayId) {
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      onUpdateOverlay(overlayId, { x, y });
    } else if (e.touches.length === 2) {
      const newPinchDistance = getPinchDistance(e.touches);
      if (pinchDistance > 0) {
        const scale = newPinchDistance / pinchDistance;
        const newSize = Math.max(20, Math.min(200, overlay.size * scale));
        onUpdateOverlay(overlayId, { size: newSize });
        setPinchDistance(newPinchDistance);
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggingOverlayId(null);
    setPinchDistance(0);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraType } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera access denied:", err));
  }, [cameraType]);

  const handleCapture = (): void => {
    console.log("Capture button pressed");
    if (timerValue > 0) {
      setCountdown(timerValue);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          setCountdown(null);
          doCapture();
          return null;
        });
      }, 1000);
    } else {
      doCapture();
    }
  };

  const doCapture = (): void => {
    console.log("Performing capture", { flashMode, cameraType, ratio, zoom });
    if (flashMode === "auto" && cameraType === "user") {
      setShowFrontGlow(true);
      setTimeout(() => setShowFrontGlow(false), 600);
    }

    if (!videoRef.current) return;
    const video = videoRef.current;

    let width = video.videoWidth;
    let height = video.videoHeight;

    const effectiveRatio = ratio === "full" ? "9/16" : ratio;
    const [w, h] = effectiveRatio.split("/").map(Number);
    const targetRatio = w / h;

    if (width / height > targetRatio) {
      width = height * targetRatio;
    } else {
      height = width / targetRatio;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        video,
        (video.videoWidth - width) / 2,
        (video.videoHeight - height) / 2,
        width,
        height,
        0,
        0,
        width,
        height
      );
      const imageData = canvas.toDataURL("image/png");
      console.log("Captured image data created");
      onPhotoCaptured(imageData);
    }
  };

  return (
    <div ref={screenRef} className="relative z-10 flex-1 overflow-hidden bg-black touch-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
        style={{ transform: `scale(${zoom})` }}
      />

      {/* Overlays */}
      {overlays.map((overlay) => (
        <img
          key={overlay.id}
          src={overlay.src}
          alt="Overlay"
          onTouchStart={(e) => handleTouchStart(e, overlay.id)}
          onTouchMove={(e) => handleTouchMove(e, overlay.id)}
          onTouchEnd={handleTouchEnd}
          className="absolute cursor-move select-none"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg) scaleX(${overlay.scaleX}) scaleY(${overlay.scaleY})`,
            opacity: overlayOpacity / 100,
            width: `${overlay.size}%`,
            height: `${overlay.size}%`,
            objectFit: "contain",
            touchAction: "none",
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-4 flex justify-center px-4">
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
          {cameraType === "user" ? "Selfie" : "Rear"}
        </div>
      </div>

      {/* Composition grid (rule of thirds) */}
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" />
        </div>
      )}

      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <span className="rounded-3xl bg-white/90 px-6 py-4 text-6xl font-semibold text-black shadow-2xl">
            {countdown}
          </span>
        </div>
      )}

      {cameraType === "user" && (flashMode === "always" || showFrontGlow) && (
        <div className="pointer-events-none absolute inset-0 z-40 animate-flashGlow">
          <div className="h-full w-full bg-white/35" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-3 z-40 flex justify-center px-4">
        <ZoomControl zoom={zoom} onChange={setZoom} />
      </div>

      <button onClick={handleCapture} className="hidden" id="hiddenCaptureTrigger" />
    </div>
  );
};

export default ViewScreen;
