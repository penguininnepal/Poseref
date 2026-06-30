import { useState } from "react";

const Grid = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className="flex flex-col items-center cursor-pointer text-white"
    >
      <span>#</span>
      <span className="text-xs">{enabled ? "On" : "Off"}</span>
    </div>
  );
};

export default Grid;
