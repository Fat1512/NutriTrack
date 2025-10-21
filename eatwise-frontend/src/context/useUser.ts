import { useQuery } from "@tanstack/react-query";
import authService from "../service/authService";

function useUser() {
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return { currentUser, isLoading };
}

export default useUser;
