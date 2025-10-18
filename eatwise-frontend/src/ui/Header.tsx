import { useLocation } from "react-router-dom";

const PATH_HEADER: Record<string, string> = {
  "/sync/dashboard/line-chart": "Sync/Dashboard/Line chart",
  "/sync/dashboard/inverter-chart": "Sync/Dashboard/Inverter chart",
  "/sync/inverter-management": "Sync/Inverter Management",
};

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const realPath = PATH_HEADER[path]?.split("/") || [];
  return (
    <div className="flex p-4 justify-between">
      <div>
        <span className="text-gray-600">{realPath[0]}</span>
        {realPath.length > 1 && ` / ${realPath.slice(1).join(" / ")}`}
      </div>
      <div className="flex items-center">
        <div>User Info</div>
      </div>
    </div>
  );
};

export default Header;
