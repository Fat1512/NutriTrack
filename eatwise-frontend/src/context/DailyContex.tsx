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
