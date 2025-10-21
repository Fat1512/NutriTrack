import { useGoalContext } from "../../context/GoalContext";
import MiniSpinner from "../../ui/MiniSpinner";
import MacroChart from "./MacroChart";
const MacroChartWrapper = () => {
  const { isLoading, goal, loadinConsume, consumseNutrient } = useGoalContext();
  if (isLoading || loadinConsume) return <MiniSpinner />;
  return <MacroChart goal={goal} consumeNutrient={consumseNutrient} />;
};

export default MacroChartWrapper;
