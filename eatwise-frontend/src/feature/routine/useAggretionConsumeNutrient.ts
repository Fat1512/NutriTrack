import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../context/AuthContext";
import { getAggretionConsumeNutrient } from "../../service/routineSerivce";
function useAggretionConsumeNutrient() {
  const { user } = useAuth();
  const { isLoading, data: consumseNutrient } = useQuery({
    queryKey: ["consumseNutrient", user?.id],
    queryFn: () => getAggretionConsumeNutrient(),
    enabled: !!user?.id,
  });

  return { isLoading, consumseNutrient };
}

export default useAggretionConsumeNutrient;
