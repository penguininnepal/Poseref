import { useState, useRef, useEffect } from "react";
import ZoomControl from "../components/ZoomControl";

interface ViewScreenProps {
  flashMode: "off" | "auto" | "always";
  ratio: string;
  timerValue: number;
  cameraType: "user" | "environment";
  setCameraType: (type: "user" | "environment") => void;
  lastPhoto: string | null;
  setLastPhoto: (photo: string | null) => void;
}

const ViewScreen: React.FC<ViewScreenProps> = ({
  flashMode,
  ratio,
  timerValue,
  cameraType,
  setCameraType,
  setLastPhoto,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showFrontGlow, setShowFrontGlow] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraType } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error("Camera access denied:", err));
  }, [cameraType]);

  const handleCapture = (): void => {
    if (timerValue > 0) {
      setCountdown(timerValue);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            setCountdown(null);
            doCapture();
            return null;
          }
        });
      }, 1000);
    } else {
      doCapture();
    }
  };

  const doCapture = (): void => {
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
        width, height,
        0, 0, width, height
      );
      const imageData = canvas.toDataURL("image/png");
      setLastPhoto(imageData);
    }
  };

  return (
    <div className="relative flex-1 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: `scale(${zoom})` }}
      />

      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
          <span className="text-black text-6xl font-bold bg-white/70 px-6 py-4 rounded-lg">
            {countdown}
          </span>
        </div>
      )}

      {/* Flash glow */}
      {cameraType === "user" && (flashMode === "always" || showFrontGlow) && (
        <div className="absolute inset-0 z-40 pointer-events-none animate-flashGlow">
          <div className="w-full h-full bg-white/40"></div>
        </div>
      )}

      {/* Zoom control */}
      <div className="absolute bottom-[120px] w-full flex justify-center z-40">
        <ZoomControl zoom={zoom} onChange={setZoom} />
      </div>

      {/* Hidden trigger for Bottom capture */}
      <button onClick={handleCapture} className="hidden" id="hiddenCaptureTrigger" />
    </div>
  );
};

export default ViewScreen;
