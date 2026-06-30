import { useState, useRef, useEffect } from "react";
import Flash, { type FlashMode } from "./Flash";
import Ratio from "./Ratio";
import Grid from "./Grid";
import OpacityControl from "./OpacityControl";
import TransformControls from "./TransformControls";
import OverlayManager from "./OverlayManager";
import CaptureButton from "./CaptureButton";
import PreviewThumbnail from "./PreviewThumbnail";
import SwapCamera from "./SwapCamera";

const Camera: React.FC = () => {
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [cameraType, setCameraType] = useState<"user" | "environment">("user");
  const [showFrontGlow, setShowFrontGlow] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [ratio, setRatio] = useState("1/1");
  const videoRef = useRef<HTMLVideoElement>(null);

  // ✅ Connect to hardware camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraType } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera access denied:", err));
  }, [cameraType]);

  const handleCapture = (): void => {
    if (flashMode === "auto" && cameraType === "user") {
      setShowFrontGlow(true);
      setTimeout(() => setShowFrontGlow(false), 600);
    }

    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setLastPhoto(imageData);
      }
    }
  };

  const handleSwapCamera = (newType: "back" | "front"): void => {
    setCameraType(newType === "front" ? "user" : "environment");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
      {/* Top bar */}
      <div className="flex justify-around items-center bg-gray-900 h-[50px] text-white text-sm">
        <Flash cameraType={cameraType === "user" ? "front" : "back"} onModeChange={setFlashMode} />
        <Ratio onChange={setRatio} />
        <Grid />
      </div>

      {/* Camera view with ratio */}
      <div className="flex justify-center items-center bg-gray-950">
        <div
          className="relative bg-black overflow-hidden"
          style={{
            aspectRatio: ratio,
            width: "100%",
            maxHeight: "500px",
          }}
        >
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

          <OpacityControl onChange={(v) => console.log("OpacityControl:", v)} />
          <TransformControls
            onRotate={() => console.log("Rotate")}
            onFlip={() => console.log("Flip")}
            onScale={() => console.log("Scale")}
          />
          <OverlayManager />

          {/* Flash glow */}
          {cameraType === "user" && (flashMode === "always" || showFrontGlow) && (
            <div className="absolute inset-0 z-40 pointer-events-none animate-flashGlow">
              <div
                className="w-full h-full"
                style={{
                  background: `
                    linear-gradient(to top, rgba(255,255,255,1) 5%, transparent 20%),
                    linear-gradient(to bottom, rgba(255,255,255,1) 5%, transparent 20%),
                    linear-gradient(to left, rgba(255,255,255,1) 5%, transparent 20%),
                    linear-gradient(to right, rgba(255,255,255,1) 5%, transparent 20%)
                  `,
                }}
              ></div>
            </div>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-0 w-full bg-gray-800/80 h-[80px] flex justify-between items-center px-6 z-50">
            <PreviewThumbnail photo={lastPhoto} />
            <CaptureButton onClick={handleCapture} />
            <SwapCamera onSwap={handleSwapCamera} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
