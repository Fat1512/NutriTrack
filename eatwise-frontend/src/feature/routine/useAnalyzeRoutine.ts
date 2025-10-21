import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../context/AuthContext";
import { analyzeRoutine } from "../../service/routineSerivce";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
function useAnalyzeRoutine() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  const { isLoading, data: analyzeData } = useQuery({
    queryKey: ["analyze"],
    queryFn: () => analyzeRoutine(pickedDate),
    enabled: !!user?.id,
    cacheTime: 0,
    staleTime: 0,
  });

  return { isLoading, analyzeData };
}

export default useAnalyzeRoutine;
