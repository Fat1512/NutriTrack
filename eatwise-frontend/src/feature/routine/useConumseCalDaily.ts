import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCalConsumePickedDate } from "../../service/routineSerivce";
import dayjs from "dayjs";

function useConumseCalDaily() {
  const [searchParams] = useSearchParams();
  const pickedDate =
    searchParams.get("pickedDate") || dayjs().format("YYYY-MM-DD");
  const { isLoading, data } = useQuery({
    queryKey: ["calDaily", pickedDate],
    queryFn: () => getCalConsumePickedDate(pickedDate),
  });

  return { isLoading, data };
}

export default useConumseCalDaily;
