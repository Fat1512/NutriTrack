import { ImEmbed } from "react-icons/im";

import SiderbarItem from "./SiderbarItem";

import { AiOutlineSchedule } from "react-icons/ai";
import { RiQrScanLine } from "react-icons/ri";
import { useSidebarContext } from "../context/SidebarContext";

const NAVIGATION_LIST = [
  {
    icon: AiOutlineSchedule,
    label: "Meal Plan",
    path: "/routine",
  },
  {
    icon: RiQrScanLine,
    label: "Scan Food",
    path: "/com",
  },
];

function Sidebar() {
  const { expanded, setExpanded } = useSidebarContext();
  return (
    <div
      className={`fixed ${
        expanded ? "w-48" : "w-12"
      } top-0 left-0 h-screen bg-[#043915] text-white z-50 transition-all ease-in-out duration-500`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {expanded && (
        <div className="text-2xl">
          <p className="p-3">EatWise</p>
        </div>
      )}

      {NAVIGATION_LIST.map(({ icon, label, path }) => (
        <SiderbarItem key={label} icon={icon} label={label} path={path} />
      ))}
    </div>
  );
}

export default Sidebar;
