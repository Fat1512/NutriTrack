import { useState } from "react";
const TOTAL_CUPS = 10;
const VOLUME = 0.2;
const WaterTracker = () => {
  const [filledCups, setFilledCups] = useState(0);

  const toggleCup = (index: number) => {
    if (index < filledCups) {
      setFilledCups(index);
    } else {
      setFilledCups(index + 1);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow w-full">
      <div className="mb-4 font-semibold">
        Water Tracker {(filledCups * VOLUME).toFixed(1)} /{" "}
        {(TOTAL_CUPS * VOLUME).toFixed(1)} L
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[...Array(TOTAL_CUPS)].map((_, idx) => (
          <div
            key={idx}
            className={`w-12 h-16 border-2 rounded-lg flex items-end justify-center cursor-pointer transition-all
              ${
                idx < filledCups
                  ? "bg-blue-400 border-blue-400"
                  : "bg-blue-100 border-blue-300"
              }
            `}
            onClick={() => toggleCup(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WaterTracker;
