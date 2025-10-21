import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MyModal from "../../ui/MyModal";
import MiniSpinner from "../../ui/MiniSpinner";
import { useGoalContext } from "../../context/GoalContext";
import { useDailyContext } from "../../context/DailyContex";

const macro = { name: "Calories", color: "#4ADE80" };

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
      <div className="bg-white p-4 shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-xl">Calories Daily</p>
          <Button onClick={() => setIsOpen((prev) => !prev)}>Edit</Button>
        </div>
        <div className="grid grid-cols-2 ">
          <div className="justify-around flex flex-col">
            <p>
              Daily goal: <span className="font-bold">{goal.dailyGoalCal}</span>{" "}
              cal
            </p>
            <p>
              Consumed:{" "}
              <span className="font-bold">
                {Math.round(routine.consumeCaloDaily)}
              </span>{" "}
              cal
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-30 h-30">
              <CircularProgressbar
                value={animatedValue}
                maxValue={goal.dailyGoalCal}
                text={`${Math.round(animatedValue)} `}
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
            </div>
          </div>
        </div>
      </div>
      <MyModal open={isOpen} onClose={handleOnClose}></MyModal>
    </>
  );
};

export default CaloryChart;
