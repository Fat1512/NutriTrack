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
