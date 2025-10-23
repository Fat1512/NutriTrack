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
import React, { createContext, useContext, useState } from "react";
interface SidebarContextType {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
interface SidebarContextProps {
  children: React.ReactNode;
}

const SidebarProvider: React.FC<SidebarContextProps> = ({ children }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};
function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within SidebarProvider");
  }
  return context;
}

export { SidebarProvider, useSidebarContext };
