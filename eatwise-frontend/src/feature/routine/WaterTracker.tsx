import { useState } from "react";
import { useDailyContext } from "../../context/DailyContex";
import useUpdateWaterConsume from "./useUpdateWaterConsume";
import { toast } from "react-toastify";
const TOTAL_CUPS = 10;
const VOLUME = 0.2;
const WaterTracker = () => {
  const { routine } = useDailyContext();
  const cups = Math.round(routine.waterConsumeDay / VOLUME);
  const [filledCups, setFilledCups] = useState(cups);
  const { isPending, updateWaterConsume } = useUpdateWaterConsume();

  const toggleCup = (index: number) => {
    const newCount = index + 1;
    const newWaterConsume = newCount * VOLUME;
    if (isPending || routine.waterConsumeDay === newCount * VOLUME) return;

    updateWaterConsume(
      {
        waterConsume: newWaterConsume,
        routineId: routine.id,
      },
      {
        onSuccess: () => {
          setFilledCups(newCount);
          toast.success("Successfully updated water consume");
        },
        onError: (err) => toast.error(err.message),
      }
    );
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
            className={`w-12 h-16 border-2 rounded-lg flex items-end justify-center cursor-pointer transition-all ${
              isPending && "cursor-not-allowed"
            }
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
