import Flash from "../components/Flash";
import Ratio from "../components/Ratio";
import Grid from "../components/Grid";
import Timer from "../components/Timer";
import Setting from "../components/Setting";

interface TopProps {
  flashMode: "off" | "auto" | "always";
  setFlashMode: (mode: "off" | "auto" | "always") => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  timerValue: number;
  setTimerValue: (value: number) => void;
}

const Top: React.FC<TopProps> = ({ setFlashMode, setRatio, setTimerValue }) => {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Flash cameraType="back" onModeChange={setFlashMode} />
        <Ratio onChange={setRatio} />
        <Grid />
      </div>
      <div className="flex items-center gap-2">
        <Timer onChange={setTimerValue} />
        <Setting />
      </div>
    </div>
  );
};

export default Top;
