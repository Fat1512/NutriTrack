import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "react-router-dom";
import { getFood } from "../../service/foodService";

function useGetFood() {
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get("foodId")!;
  const { isLoading, data: food } = useQuery({
    queryKey: ["food", foodId],
    queryFn: () => getFood(foodId),
  });

  return { isLoading, food };
}

export default useGetFood;
