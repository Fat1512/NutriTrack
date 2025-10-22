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
import React, { createContext, useContext } from "react";

import useGetGoal from "../feature/routine/useGetGoal";
import useAggretionConsumeNutrient from "../feature/routine/useAggretionConsumeNutrient";
export interface Goal {
  id: string;
  goalCal: number;
  goalProtein: number;
  goalCarb: number;
  goalFat: number;
  dailyGoalCal: number;
}
export interface ConsumeNutrient {
  userId: string;
  consumeProtein: number;
  consumeCal: number;
  consumeCarb: number;
  consumeFat: number;
  [key: string]: number | string;
}
interface GoalContexType {
  isLoading: boolean;
  goal: Goal;
  loadinConsume: boolean;
  consumseNutrient: ConsumeNutrient;
}
const GoalContext = createContext<GoalContexType | undefined>(undefined);
interface GoalContextProps {
  children: React.ReactNode;
}

const GoalProvider: React.FC<GoalContextProps> = ({ children }) => {
  const { isLoading, goal } = useGetGoal();
  const { isLoading: loadinConsume, consumseNutrient } =
    useAggretionConsumeNutrient();

  return (
    <GoalContext.Provider
      value={{ isLoading, loadinConsume, goal, consumseNutrient }}
    >
      {children}
    </GoalContext.Provider>
  );
};
function useGoalContext() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoalContext must be used within GoalProvider");
  }
  return context;
}

export { GoalProvider, useGoalContext };
