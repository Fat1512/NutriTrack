import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MyModal from "../../ui/MyModal";

const macro = { name: "Calories", value: 35, target: 116, color: "#4ADE80" };

const CaloryChart = () => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function handleOnClose() {
    setIsOpen(false);
  }
  useEffect(() => {
    const duration = 500; // thời gian animation
    const intervalTime = 20; // update mỗi 20ms
    const steps = duration / intervalTime;
    const increment = macro.value / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedValue((prev) => Math.min(prev + increment, macro.value));
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-white p-4 shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-xl">Calories</p>
          <Button onClick={() => setIsOpen((prev) => !prev)}>Edit</Button>
        </div>
        <div className="grid grid-cols-2 ">
          <div className="justify-around flex flex-col">
            <p>
              Daily goal: <span className="font-bold">1800</span> cal
            </p>
            <p>
              Consumed: <span className="font-bold">1800</span> cal
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-30 h-30">
              <CircularProgressbar
                value={animatedValue}
                maxValue={macro.target}
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
