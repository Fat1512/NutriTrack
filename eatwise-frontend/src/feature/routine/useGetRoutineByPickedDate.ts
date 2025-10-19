import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getRoutineByPickedDate } from "../../service/routineSerivce";
import dayjs from "dayjs";

function useGetRoutineByPickedDate() {
  const [searchParams] = useSearchParams();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  const { isLoading, data: routine } = useQuery({
    queryKey: ["pickedDate", pickedDate],
    queryFn: () => getRoutineByPickedDate(pickedDate),
  });

  return { isLoading, routine };
}

export default useGetRoutineByPickedDate;
