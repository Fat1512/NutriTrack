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
