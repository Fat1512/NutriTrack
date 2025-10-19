import StepperComponentModern, {
  type UserPreferences,
} from "../feature/onboarding/StepperComponentModern";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useUpdatePersonalization from "../feature/onboarding/useUpdatePersonalization";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { updatePersonalizationAsync } = useUpdatePersonalization();

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    try {
      const response = await updatePersonalizationAsync(preferences);

      if (user) {
        queryClient.setQueryData(["currentUser"], {
          ...user,
          ...response,
          isOnboarded: true,
        });
      }

      navigate("/", { replace: true });
    } catch (error) {
      navigate("/", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <StepperComponentModern onComplete={handleOnboardingComplete} />
    </Box>
  );
};

export default OnboardingPage;
