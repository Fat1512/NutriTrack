import { useQuery } from "@tanstack/react-query";

import { getStaticNutrient } from "../../service/routineSerivce";
interface StaticsNutrientParams {
  month: number;
  year: number;
}

function useStaticsNutrient({ month, year }: StaticsNutrientParams) {
  const { isLoading, data } = useQuery({
    queryKey: ["statics", month, year],
    queryFn: () => getStaticNutrient(month, year),
  });

  return { isLoading, data };
}

export default useStaticsNutrient;
