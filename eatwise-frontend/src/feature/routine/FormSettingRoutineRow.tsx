import type React from "react";
import type { Meal } from "./FormSettingRoutine";
import LogModal from "../../ui/LogModal";
import { useState } from "react";

interface FormSettingRoutineRow {
  icon: string;
  label: string;
  meals: Meal[];
}

const FormSettingRoutineRow: React.FC<FormSettingRoutineRow> = ({
  icon,
  label,
  meals,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleOnClose() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold">{label}</span>
            <span className="text-gray-500 text-sm">
              {meals.reduce((sum, m) => sum + m.calories, 0)} cal
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-100 cursor-pointer text-green-700 px-3 py-1 rounded hover:bg-green-200"
          >
            + Log
          </button>
        </div>
        {meals.length === 0 ? (
          <p className="text-gray-400 text-sm">No items logged yet</p>
        ) : (
          <div className="space-y-2">
            {meals.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.calories} Calories
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">{">"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <LogModal open={isOpen} onClose={handleOnClose} />
    </>
  );
};

export default FormSettingRoutineRow;
