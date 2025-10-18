import Button from "../../ui/Button";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MyModal from "../../ui/MyModal";

const macros = [
  { name: "Protein", value: 35, target: 116, color: "#F87171" },
  { name: "Carbs", value: 79, target: 214, color: "#FBBF24" },
  { name: "Fat", value: 46, target: 51, color: "#60A5FA" },
  { name: "Fibre", value: 14, target: 30, color: "#4ADE80" },
];

export default function MacroChart() {
  const [animatedValues, setAnimatedValues] = useState(macros.map(() => 0));
  const [isOpen, setIsOpen] = useState(false);

  function handleOnClose() {
    setIsOpen(false);
  }
  useEffect(() => {
    const duration = 500;
    const intervalTime = 20;
    const steps = duration / intervalTime;

    const increments = macros.map((macro) => macro.value / steps);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedValues((prev) =>
        prev.map((val, i) => Math.min(val + increments[i], macros[i].value))
      );
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-white  p-4 shadow-xl rounded-lg">
        <div className="flex justify-end pb-2">
          <Button onClick={() => setIsOpen((prev) => !prev)}>Edit</Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {macros.map((macro, index) => {
            return (
              <div key={macro.name} className="flex flex-col items-center">
                <div className="w-25 h-25">
                  <CircularProgressbar
                    value={animatedValues[index]}
                    maxValue={macro.target}
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
                  <div className="text-sm text-gray-500">/{macro.target}g</div>
                  <div className="text-xs text-gray-400">
                    {Math.round(macro.target - animatedValues[index])}g left
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
}
