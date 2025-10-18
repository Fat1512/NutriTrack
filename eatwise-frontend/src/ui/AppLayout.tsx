import { Outlet } from "react-router";
import Sidebar from "./Siderbar";
import Header from "./Header";
import { useSidebarContext } from "../context/SidebarContext";

function AppLayout() {
  const { expanded } = useSidebarContext();

  return (
    <div className="flex text-black">
      <Sidebar />

      <main
        className={`w-full ${
          expanded ? "pl-48" : "pl-12"
        } transition-all duration-500 bg-white flex flex-col pb-20 pr-0 pt-0`}
      >
        <Header />

        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
