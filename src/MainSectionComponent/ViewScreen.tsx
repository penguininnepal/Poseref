import { useState, useRef, useEffect } from "react";
import ZoomControl from "../components/ZoomControl";

interface ViewScreenProps {
  flashMode: "off" | "auto" | "always";
  ratio: string;
  timerValue: number;
  cameraType: "user" | "environment";
  onPhotoCaptured: (photo: string) => void;
}

const ViewScreen: React.FC<ViewScreenProps> = ({
  flashMode,
  ratio,
  timerValue,
  cameraType,
  onPhotoCaptured,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showFrontGlow, setShowFrontGlow] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className="relative flex-1 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
        style={{ transform: `scale(${zoom})` }}
      />

      <div className="absolute inset-x-0 top-4 flex justify-center px-4">
        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-white/80 backdrop-blur-md">
          {cameraType === "user" ? "Selfie" : "Rear"}
        </div>
      </div>

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

      <div className="absolute bottom-[152px] z-40 flex w-full justify-center px-4">
        <ZoomControl zoom={zoom} onChange={setZoom} />
      </div>

      <button onClick={handleCapture} className="hidden" id="hiddenCaptureTrigger" />
    </div>
  );
};

export default ViewScreen;
