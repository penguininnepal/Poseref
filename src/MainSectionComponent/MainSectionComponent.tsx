import { useState } from "react";
import Top from "./Top";
import ViewScreen from "./ViewScreen";
import Bottom from "./Bottom";

const MainSectionComponent: React.FC = () => {
  // Shared state
  const [flashMode, setFlashMode] = useState<"off" | "auto" | "always">("off");
  const [ratio, setRatio] = useState("3/4");
  const [timerValue, setTimerValue] = useState<number>(0);
  const [cameraType, setCameraType] = useState<"user" | "environment">("user");
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full h-screen">
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
        lastPhoto={lastPhoto}
        setLastPhoto={setLastPhoto}
      />
      <Bottom
        onCapture={() => document.getElementById("hiddenCaptureTrigger")?.click()}
        lastPhoto={lastPhoto}
        onSwapCamera={(t) => setCameraType(t === "front" ? "user" : "environment")}
      />
    </div>
  );
};

export default MainSectionComponent;
