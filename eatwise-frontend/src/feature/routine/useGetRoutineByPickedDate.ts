import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getRoutineByPickedDate } from "../../service/routineSerivce";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

function useGetRoutineByPickedDate() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  const { isLoading, data: routine } = useQuery({
    queryKey: ["pickedDate", pickedDate],
    queryFn: () => getRoutineByPickedDate(pickedDate),
    enabled: !!user?.id,
  });

  return { isLoading, routine };
}

export default useGetRoutineByPickedDate;
