import AskAIWrapper from "../feature/routine/AskAIWrapper";
import CaloryChart from "../feature/routine/CaloryChart";
import DatePicker from "../feature/routine/DatePicker";
import FormSettingRoutine from "../feature/routine/FormSettingRoutine";
import Goal from "../feature/routine/Goal";
import MacroChartWrapper from "../feature/routine/MacroChartWrapper";
import WaterTracker from "../feature/routine/WaterTracker";

const RoutinePage = () => {
  return (
    <div className="px-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 grid grid-cols-8 gap-2">
          <div className="col-span-3">
            <DatePicker />
          </div>
          <div className="col-span-5">
            <FormSettingRoutine />
          </div>
        </div>
        <div className="col-span-4 space-y-2">
          <CaloryChart />
          <WaterTracker />
        </div>
      </div>
      <div className="grid grid-cols-2 my-2 space-x-5">
        <MacroChartWrapper />
        <Goal />
      </div>
      <AskAIWrapper />
    </div>
  );
};

export default RoutinePage;
