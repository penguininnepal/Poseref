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
    <div className="flex justify-around items-center bg-gray-900 h-[50px] text-white text-sm">
      <Flash cameraType="back" onModeChange={setFlashMode} />
      <Ratio onChange={setRatio} />
      <Grid />
      <Timer onChange={setTimerValue} />
      <Setting />
    </div>
  );
};

export default Top;
