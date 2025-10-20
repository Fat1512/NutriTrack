import Button from "../../ui/Button";
import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MyModal from "../../ui/MyModal";

import { type ConsumeNutrient, type Goal } from "../../context/GoalContext";

const macros = [
  {
    name: "Protein",
    valueField: "consumeProtein",
    targetField: "goalProtein",
    color: "#F87171",
  },
  {
    name: "Carbs",
    valueField: "consumeCarb",
    targetField: "goalCarb",
    color: "#FBBF24",
  },
  {
    name: "Fat",
    valueField: "consumeFat",
    targetField: "goalFat",
    color: "#60A5FA",
  },
  {
    name: "Calories",
    valueField: "consumeCal",
    targetField: "goalCal",
    color: "#4ADE80",
  },
];
type ConsumeNutrientKeys =
  | "consumeProtein"
  | "consumeCal"
  | "consumeCarb"
  | "consumeFat";
interface MarcroChartProps {
  goal: Goal;
  consumeNutrient: ConsumeNutrient;
}
const MacroChart: React.FC<MarcroChartProps> = ({ goal, consumeNutrient }) => {
  const [animatedValues, setAnimatedValues] = useState(macros.map(() => 0));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const duration = 500;
    const intervalTime = 20;
    const steps = duration / intervalTime;

    const increments = macros.map((macro) => {
      const value = consumeNutrient[macro.valueField as ConsumeNutrientKeys];
      return value / steps;
    });
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedValues((prev) =>
        prev.map((val, i) =>
          Math.min(
            val + increments[i],
            consumeNutrient[macros[i].valueField as ConsumeNutrientKeys]
          )
        )
      );
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  function handleOnClose() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="bg-white  p-4 shadow-xl rounded-lg">
        <div className="flex justify-between pb-2">
          <p className="font-bold text-xl">Consume Nutrients Weekly</p>
          <Button onClick={() => setIsOpen((prev) => !prev)}>Edit</Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {macros.map((macro, index) => {
            return (
              <div key={macro.name} className="flex flex-col items-center">
                <div className="w-25 h-25">
                  <CircularProgressbar
                    value={animatedValues[index] || 0}
                    maxValue={goal[macro.targetField]}
                    text={`${Math.round(animatedValues[index])}`}
                    styles={buildStyles({
                      pathColor: macro.color,
                      textColor: "#111827",
                      trailColor: "#E5E7EB",
                      textSize: "24px",
                    })}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className="font-semibold">{macro.name}</div>
                  <div className="text-sm text-gray-500">
                    /{goal[macro.targetField]}g
                  </div>
                  <div className="text-xs text-gray-400">
                    {goal[macro.targetField] - animatedValues[index] > 0
                      ? Math.round(
                          goal[macro.targetField] - animatedValues[index]
                        )
                      : "0"}
                    g left
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <MyModal open={isOpen} onClose={handleOnClose} />
      </div>
    </>
  );
};
export default MacroChart;
