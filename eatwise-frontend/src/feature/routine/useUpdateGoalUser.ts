import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Resposne } from "./useAddFoodToRoutine";

import type { Goal } from "../../context/GoalContext";
import userService from "../../service/userService";
import { useAuth } from "../../context/AuthContext";

export default function useUpdateGoalUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isPending, mutate: updateUserGoal } = useMutation<
    Resposne,
    Error,
    Goal
  >({
    mutationFn: ({
      id,
      goalCal,
      goalFat,
      goalProtein,
      goalCarb,
      dailyGoalCal,
    }) =>
      userService.updateUserGoal({
        id,
        goalCal,
        goalFat,
        goalProtein,
        goalCarb,
        dailyGoalCal,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["goal", user?.id],
      });
    },
  });
  return { isPending, updateUserGoal };
}
