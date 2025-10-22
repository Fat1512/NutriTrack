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
import { useState } from "react";
import MiniSpinner from "../../ui/MiniSpinner";
import FormSettingRoutineRow from "./FormSettingRoutineRow";
import type { MealKey } from "./useAddFoodToRoutine";
import LogModal from "../../ui/LogModal";
import { useDailyContext } from "../../context/DailyContex";

const MEALS: { key: MealKey; label: string; icon: string }[] = [
  { key: "BREAKFAST", label: "Breakfast", icon: "☕" },
  { key: "LUNCH", label: "Lunch", icon: "🥗" },
  { key: "DINNER", label: "Dinner", icon: "🌙" },
];

const FormSettingRoutine = () => {
  const { isLoading, routine } = useDailyContext();
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
