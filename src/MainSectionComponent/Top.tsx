import { useState } from "react";
import Flash, { type FlashMode } from "../components/Flash";
import Ratio from "../components/Ratio";
import Grid from "../components/Grid";
import Timer from "../components/Timer";
import Setting from "../components/Setting";

interface TopProps {
  flashMode: FlashMode;
  setFlashMode: (mode: FlashMode) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  timerValue: number;
  setTimerValue: (value: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
}

type Panel = null | "flash" | "ratio" | "timer" | "settings";

const Top: React.FC<TopProps> = ({
  flashMode,
  setFlashMode,
  ratio,
  setRatio,
  timerValue,
  setTimerValue,
  showGrid,
  setShowGrid,
}) => {
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  const toggle = (panel: Exclude<Panel, null>) =>
    setOpenPanel((current) => (current === panel ? null : panel));

  const close = () => setOpenPanel(null);

  return (
    <div className="relative z-50 shrink-0 overflow-visible border-b border-white/10 bg-black/60 px-3 py-2.5 backdrop-blur-xl">
      <div className="relative z-50 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <Flash
            value={flashMode}
            open={openPanel === "flash"}
            onToggle={() => toggle("flash")}
            onChange={(mode) => {
              setFlashMode(mode);
              close();
            }}
          />
          <Ratio
            value={ratio}
            open={openPanel === "ratio"}
            onToggle={() => toggle("ratio")}
            onChange={(value) => {
              setRatio(value);
              close();
            }}
          />
          <Grid enabled={showGrid} onToggle={() => setShowGrid(!showGrid)} />
        </div>
        <div className="flex items-center gap-1.5">
          <Timer
            value={timerValue}
            open={openPanel === "timer"}
            onToggle={() => toggle("timer")}
            onChange={(value) => {
              setTimerValue(value);
              close();
            }}
          />
          <Setting
            open={openPanel === "settings"}
            onToggle={() => toggle("settings")}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            flashMode={flashMode}
            timerValue={timerValue}
            ratio={ratio}
            onResetCamera={() => {
              setFlashMode("off");
              setRatio("3/4");
              setTimerValue(0);
              setShowGrid(false);
              close();
            }}
          />
        </div>
      </div>

      {/* Tap outside to close any open menu — fixes stuck popups */}
      {openPanel !== null && (
        <button
          aria-label="Close menu"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-transparent"
        />
      )}
    </div>
  );
};

export default Top;
