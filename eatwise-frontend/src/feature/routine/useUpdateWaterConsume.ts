/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
