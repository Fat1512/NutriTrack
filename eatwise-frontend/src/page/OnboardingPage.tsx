import StepperComponentModern from "../feature/onboarding/StepperComponentModern";
import { Box } from "@mui/material";

const OnboardingPage = () => {
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
      <StepperComponentModern />
    </Box>
  );
};

export default OnboardingPage;
