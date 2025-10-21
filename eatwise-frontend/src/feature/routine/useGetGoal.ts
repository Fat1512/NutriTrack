import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../context/AuthContext";
import userService from "../../service/userService";
function useGetGoal() {
  const { user } = useAuth();
  const { isLoading, data: goal } = useQuery({
    queryKey: ["goal", user?.id],
    queryFn: () => userService.getGoalUser(),
    enabled: !!user?.id,
  });

  return { isLoading, goal };
}

export default useGetGoal;
