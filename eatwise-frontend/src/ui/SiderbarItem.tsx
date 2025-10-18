import type React from "react";
import { useEffect, useState, type ElementType } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
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
        className={`flex w-full items-center px-3 ${
          !isActive && "hover:text-gray-300"
        }  ${
          isActive && expanded && "bg-gray-200 text-black"
        } gap-3 py-3 cursor-pointer `}
      >
        <span className="text-xl">{<Icon />}</span>
        <span
          className={`whitespace-nowrap flex items-center justify-between flex-1 transition-opacity duration-500  ${
            expanded ? "opacity-100 block" : "opacity-0 hidden"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default SiderbarItem;
