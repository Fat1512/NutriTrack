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
import SiderbarItem from "./SiderbarItem";

import { AiOutlineSchedule } from "react-icons/ai";
import { IoMdJournal } from "react-icons/io";
import { useSidebarContext } from "../context/SidebarContext";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useDailyContext } from "../context/DailyContex";
import { useGoalContext } from "../context/GoalContext";
import { FaBrain } from "react-icons/fa";
const NAVIGATION_LIST = [
  {
    icon: AiOutlineSchedule,
    label: "Meal Plan",
    path: "/routine",
  },
  {
    icon: IoMdJournal,
    label: "Nutrition Detection",
    path: "/scanning",
    active: true,
  },
  {
    icon: TbLayoutDashboardFilled,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: FaBrain,
    label: "Chatbot",
    path: "/chatbot",
  },
];

function Sidebar() {
  const { expanded, setExpanded } = useSidebarContext();
  const { routine } = useDailyContext();
  const { goal } = useGoalContext();
  return (
    <div
      className={`fixed ${
        expanded ? "w-70" : "w-18"
      } top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 shadow-xl  transition-all ease-in-out duration-300`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {expanded && (
            <h2 className="text-xl font-bold text-gray-800 transition-all duration-300">
              NutriTrack
            </h2>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {NAVIGATION_LIST.map(({ icon, label, path }) => (
            <SiderbarItem key={label} icon={icon} label={label} path={path} />
          ))}
        </div>
      </nav>

      {expanded && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Daily Progress
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Calories</span>
                <span className="font-medium text-gray-800">
                  {Math.round(routine.consumeCaloDaily)} / {goal.dailyGoalCal}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(
                      (routine.consumeCaloDaily / goal.dailyGoalCal) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
