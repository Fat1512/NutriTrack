import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useSearchParams } from "react-router-dom";
import { PAGE, PAGE_SIZE } from "../../utils/contanst";
import { getFoods } from "../../service/foodService";

export default function useGetFoods() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page: number = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string, 10)
    : PAGE;

  const size: number = searchParams.get("size")
    ? parseInt(searchParams.get("size") as string, 10)
    : PAGE_SIZE;

  const { isLoading, data } = useQuery({
    queryKey: ["foods", page, size],
    queryFn: () =>
      getFoods({
        page,
        size,
      }),
  });
  const { content: foods = [], totalElements, totalPages, isLast } = data ?? {};

  if (page + 1 < totalPages) {
    queryClient.prefetchQuery({
      queryKey: ["foods", page + 1, size],
      queryFn: () =>
        getFoods({
          page: page + 1,
          size,
        }),
    });
  }

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["foods", page - 1, size],
      queryFn: () =>
        getFoods({
          page: page - 1,
          size,
        }),
    });

  return { isLoading, page, foods, totalElements, totalPages, isLast };
}
