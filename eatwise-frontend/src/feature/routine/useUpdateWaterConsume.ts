import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Resposne } from "./useAddFoodToRoutine";
import { updateWaterConsume as updateWaterConsumeAPI } from "../../service/routineSerivce";
import { useSearchParams } from "react-router-dom";

export default function useUpdateWaterConsume() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const pickedDate = searchParams.get("pickedDate");
  const { isPending, mutate: updateWaterConsume } = useMutation<
    Resposne,
    Error,
    { routineId: string; waterConsume: number }
  >({
    mutationFn: ({ routineId, waterConsume }) =>
      updateWaterConsumeAPI({ routineId, waterConsume }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["pickedDate", pickedDate],
      });
    },
  });
  return { isPending, updateWaterConsume };
}
