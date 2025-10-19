import { useState } from "react";
import MiniSpinner from "../../ui/MiniSpinner";
import FormSettingRoutineRow from "./FormSettingRoutineRow";
import type { MealKey } from "./useAddFoodToRoutine";
import useGetRoutineByPickedDate from "./useGetRoutineByPickedDate";
import LogModal from "../../ui/LogModal";

const MEALS: { key: MealKey; label: string; icon: string }[] = [
  { key: "BREAKFAST", label: "Breakfast", icon: "☕" },
  { key: "LUNCH", label: "Lunch", icon: "🥗" },
  { key: "DINNER", label: "Dinner", icon: "🌙" },
];

const FormSettingRoutine = () => {
  const { isLoading, routine } = useGetRoutineByPickedDate();
  const [selectedLog, setSelectLog] = useState<MealKey | null>(null);
  function handleOnClose() {
    setSelectLog(null);
  }
  if (isLoading) return <MiniSpinner />;

  return (
    <>
      <div className="px-4 space-y-4">
        {MEALS.map((meal) => (
          <FormSettingRoutineRow
            key={meal.key}
            meals={routine.foods[meal.key]}
            icon={meal.icon}
            label={meal.label}
            setSelectLog={() => setSelectLog(meal.key)}
          />
        ))}
      </div>
      {selectedLog && (
        <LogModal
          mealKey={selectedLog}
          open={selectedLog ? true : false}
          onClose={handleOnClose}
        />
      )}
    </>
  );
};

export default FormSettingRoutine;
