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
