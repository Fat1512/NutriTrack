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
          expanded ? "pl-72" : "pl-20"
        } transition-all duration-500 flex flex-col pb-20 pr-0 pt-0`}
      >
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
