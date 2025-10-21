import { useQuery } from "@tanstack/react-query";

import { getIngredient } from "../../service/ingredientService";

function useGetIngredients() {
  const { isLoading, data: ingredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredient(),
  });

  return { isLoading, ingredients };
}

export default useGetIngredients;
