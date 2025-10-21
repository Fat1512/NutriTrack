import type React from "react";
import { type ElementType } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";

export interface SubSiderbarProps {
  icon: ElementType;
  label: string;
  path: string;
}

const SiderbarItem: React.FC<SubSiderbarProps> = ({ icon, label, path }) => {
  const { expanded } = useSidebarContext();

  const location = useLocation();
  const navigate = useNavigate();
  const Icon = icon;
  function handleOnClick() {
    navigate(path);
  }

  const isActive = location.pathname === `${path}`;

  return (
    <div className="w-full">
      <div
        onClick={() => handleOnClick()}
        className={`flex w-full items-center px-3 py-3 rounded-xl mx-1 cursor-pointer transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
            : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
        }`}
      >
        <div
          className={`flex items-center justify-center w-6 h-6 ${
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          }`}
        >
          <Icon className="text-xl" />
        </div>

        {expanded && (
          <span
            className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default SiderbarItem;
