import SiderbarItem from "./SiderbarItem";

import { AiOutlineSchedule } from "react-icons/ai";
import {
  MdDashboard,
  MdCalendarToday,
  MdMessage,
  MdRestaurantMenu,
  MdFitnessCenter,
  MdInsights,
} from "react-icons/md";
import { IoMdJournal } from "react-icons/io";
import { TrendingUp } from "@mui/icons-material";
import { useSidebarContext } from "../context/SidebarContext";

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
];

function Sidebar() {
  const { expanded, setExpanded } = useSidebarContext();
  return (
    <div
      className={`fixed ${
        expanded ? "w-70" : "w-18"
      } top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 shadow-xl  transition-all ease-in-out duration-300`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {expanded && (
            <h2 className="text-xl font-bold text-gray-800 transition-all duration-300">
              NutriTrack
            </h2>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {NAVIGATION_LIST.map(({ icon, label, path }) => (
            <SiderbarItem key={label} icon={icon} label={label} path={path} />
          ))}
        </div>
      </nav>

      {/* Bottom Section - Daily Progress */}
      {expanded && (
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Daily Progress
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Calories</span>
                <span className="font-medium text-gray-800">1,200 / 2,000</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-3/5 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
