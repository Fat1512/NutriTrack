/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MyModal from "../../ui/MyModal";
import MiniSpinner from "../../ui/MiniSpinner";
import { useGoalContext } from "../../context/GoalContext";
import { useDailyContext } from "../../context/DailyContex";

const macro = { name: "Calories", color: "#34D399" };

const CaloryChart = () => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, goal } = useGoalContext();
  const { isLoading: loadingDaily, routine } = useDailyContext();

  useEffect(() => {
    let interval: number | null = null;

    if (!loadingDaily && routine) {
      const duration = 500;
      const intervalTime = 20;
      const steps = duration / intervalTime;
      const increment = routine.consumeCaloDaily / steps;

      let currentStep = 0;
      interval = window.setInterval(() => {
        currentStep++;
        setAnimatedValue((prev) =>
          Math.min(prev + increment, routine.consumeCaloDaily)
        );
        if (currentStep >= steps && interval !== null) {
          clearInterval(interval);
        }
      }, intervalTime);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [loadingDaily, routine]);

  if (isLoading || loadingDaily) return <MiniSpinner />;

  function handleOnClose() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-800 tracking-tight">
            🔥 Daily Calories
          </h2>
          <Button
            onClick={() => setIsOpen((prev) => !prev)}
            className="px-3 py-1 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md transition-all"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 items-center">
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Goal:</span>{" "}
              <span className="font-bold text-green-600">
                {goal.dailyGoalCal}
              </span>{" "}
              cal
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Consumed:</span>{" "}
              <span className="font-bold text-blue-600">
                {Math.round(routine.consumeCaloDaily)}
              </span>{" "}
              cal
            </p>

            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      (routine.consumeCaloDaily / goal.dailyGoalCal) * 100
                    }%`,
                    backgroundColor: macro.color,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-28 h-28 drop-shadow-sm">
              <CircularProgressbar
                value={animatedValue}
                maxValue={goal.dailyGoalCal}
                text={`${Math.round(animatedValue)}`}
                styles={buildStyles({
                  pathColor: macro.color,
                  textColor: "#1F2937",
                  trailColor: "#E5E7EB",
                  textSize: "22px",
                  strokeLinecap: "round",
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <MyModal open={isOpen} onClose={handleOnClose}></MyModal>
    </>
  );
};

export default CaloryChart;
