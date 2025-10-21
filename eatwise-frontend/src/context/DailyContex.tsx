import React, { createContext, useContext } from "react";
import useGetRoutineByPickedDate from "../feature/routine/useGetRoutineByPickedDate";
import FullPageSpinner from "../ui/FullPageSpinner";

interface DailyContextType {
  isLoading: boolean;
  routine: any;
}
const DailyContext = createContext<DailyContextType | undefined>(undefined);
interface DailyContextProps {
  children: React.ReactNode;
}

const DailyProvider: React.FC<DailyContextProps> = ({ children }) => {
  const { isLoading, routine } = useGetRoutineByPickedDate();
  if (isLoading) return <FullPageSpinner />;
  return (
    <DailyContext.Provider value={{ isLoading, routine }}>
      {children}
    </DailyContext.Provider>
  );
};

function useDailyContext() {
  const context = useContext(DailyContext);
  if (context === undefined) {
    throw new Error("useDailyContext must be used within DailyProvider");
  }
  return context;
}

export { DailyProvider, useDailyContext };
