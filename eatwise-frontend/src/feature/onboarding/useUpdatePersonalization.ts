import { useMutation } from "@tanstack/react-query";
import userService from "../../service/userService";
import { useAuth } from "../../context/AuthContext";
import type { UserPreferences } from "./StepperComponentModern";

function useUpdatePersonalization() {
  const { user } = useAuth();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationFn: (data: UserPreferences) =>
      userService.updatePersonalization(data, user?.id),
  });

  return {
    updatePersonalization: mutate,
    updatePersonalizationAsync: mutateAsync,
    isLoading: isPending,
    error: error,
  };
}

export default useUpdatePersonalization;
