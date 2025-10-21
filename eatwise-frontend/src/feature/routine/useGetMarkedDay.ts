import { useQuery } from "@tanstack/react-query";

import { getMarkedDay } from "../../service/routineSerivce";
interface MarkedDayParams {
  month: number;
  year: number;
}

function useGetMarkedDay({ month, year }: MarkedDayParams) {
  const { isLoading, data } = useQuery({
    queryKey: ["marked", month, year],
    queryFn: () => getMarkedDay(month, year),
  });

  return { isLoading, data };
}

export default useGetMarkedDay;
