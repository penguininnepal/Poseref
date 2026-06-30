import OpacityControl from "../components/OpacityControl";
import OverlayManager from "../components/OverlayManager";
import TransformControls from "../components/TransformControls";
import PreviewThumbnail from "../components/PreviewThumbnail";
import CaptureButton from "../components/CaptureButton";
import SwapCamera from "../components/SwapCamera";

interface BottomProps {
  onCapture: () => void;
  lastPhoto: string | null;
  onSwapCamera: (type: "front" | "back") => void;
}

const Bottom: React.FC<BottomProps> = ({ onCapture, lastPhoto, onSwapCamera }) => {
  return (
    <div className="bg-gray-800/80 h-[120px] flex flex-col justify-between px-6 z-50">
      {/* Overlay group */}
      <div className="flex justify-center gap-4 py-2">
        <OpacityControl onChange={(v) => console.log("Opacity:", v)} />
        <OverlayManager />
        <TransformControls
          onRotate={() => console.log("Rotate")}
          onFlip={() => console.log("Flip")}
          onScale={() => console.log("Scale")}
        />
      </div>

      {/* Capture group */}
      <div className="flex justify-between items-center">
        <PreviewThumbnail photo={lastPhoto} />
        <CaptureButton onClick={onCapture} />
        <SwapCamera onSwap={onSwapCamera} />
      </div>
    </div>
  );
};

export default Bottom;
