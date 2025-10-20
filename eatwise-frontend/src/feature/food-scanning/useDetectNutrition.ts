import { useMutation } from "@tanstack/react-query";
import { detectNutrition } from "../../service/foodService";

function useDetectNutrition() {
  const { isPending, error, mutateAsync } = useMutation({
    mutationFn: (data: FormData) => detectNutrition(data),
  });

  return {
    detectNutrition: mutateAsync,
    isLoading: isPending,
    error: error,
  };
}

export default useDetectNutrition;
