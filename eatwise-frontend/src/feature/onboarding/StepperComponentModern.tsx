import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import MainGoalStep from "./MainGoalStep";
import GenderStep from "./GenderStep";
import AgeStep from "./AgeStep";
import HeightStep from "./HeightStep";
import WeightStep from "./WeightStep";
import TargetWeightStep from "./TargetWeightStep";
import HealthIssuesStep from "./HealthIssuesStep";
import DietStep from "./DietStep";
import EatingHabitsStep from "./EatingHabitsStep";

export interface UserPreferences {
  mainGoal: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  healthIssues: string[];
  specificDiet: string[];
  eatingHabits: string;
}

const steps = [
  "Main Goal",
  "Gender",
  "Age",
  "Height",
  "Weight",
  "Target Weight",
  "Health Issues",
  "Diet Type",
  "Eating Habits",
];

interface StepperComponentProps {
  onComplete: (preferences: UserPreferences) => void;
}

const StepperComponent: React.FC<StepperComponentProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    mainGoal: "",
    gender: "",
    age: 30,
    height: 150,
    weight: 50,
    targetWeight: 50,
    healthIssues: [],
    specificDiet: [],
    eatingHabits: "",
  });

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete(preferences);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!preferences.mainGoal;
      case 1:
        return !!preferences.gender;
      case 2:
        return preferences.age > 0;
      case 3:
        return preferences.height > 0;
      case 4:
        return preferences.weight > 0;
      case 5:
        return preferences.targetWeight > 0;
      case 6:
        return preferences.healthIssues.length > 0;
      case 7:
        return preferences.specificDiet.length > 0;
      case 8:
        return !!preferences.eatingHabits;
      default:
        return false;
    }
  };

  const renderStepContent = (step: number) => {
    const commonProps = {
      preferences,
      updatePreference,
    };

    switch (step) {
      case 0:
        return <MainGoalStep {...commonProps} />;
      case 1:
        return <GenderStep {...commonProps} />;
      case 2:
        return <AgeStep {...commonProps} />;
      case 3:
        return <HeightStep {...commonProps} />;
      case 4:
        return <WeightStep {...commonProps} />;
      case 5:
        return <TargetWeightStep {...commonProps} />;
      case 6:
        return <HealthIssuesStep {...commonProps} />;
      case 7:
        return <DietStep {...commonProps} />;
      case 8:
        return <EatingHabitsStep {...commonProps} />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "70%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        // overflow: "hidden",
      }}
    >
      {/* Progress Bar */}
      <Box
        sx={{
          height: 4,
          backgroundColor: "#F5F5F5",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: "#000",
            transition: "width 0.3s ease",
            width: `${((activeStep + 1) / steps.length) * 100}%`,
          }}
        />
      </Box>

      {/* Main Content Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          //   maxWidth: { xs: 600, md: 800, lg: 1000 },
          mx: "auto",
          width: "70%",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Step Info - Top Center */}
        <Box
          sx={{
            py: { xs: 2, md: 3 },
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#999",
              mb: 1,
              fontSize: { xs: "14px", md: "16px" },
            }}
          >
            Step {activeStep + 1} of {steps.length}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "24px", md: "32px", lg: "36px" },
              color: "#000",
            }}
          >
            {steps[activeStep]}
          </Typography>
        </Box>

        {/* Step Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // paddingBottom: 40,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: { xs: 2, md: 4 },
              boxShadow: { xs: "none", md: "0 8px 32px rgba(0,0,0,0.08)" },
              border: { xs: "none", md: "1px solid #F0F0F0" },
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "auto",
              maxHeight: "100%",
            }}
          >
            {renderStepContent(activeStep)}
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              borderRadius: 3,
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              color: "#666",
              border: "1px solid #E0E0E0",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#F5F5F5",
                borderColor: "#000",
              },
              "&:disabled": {
                opacity: 0.3,
              },
            }}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepComplete(activeStep)}
            sx={{
              borderRadius: 3,
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              backgroundColor: "#000",
              color: "#FFFFFF",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#333",
              },
              "&:disabled": {
                backgroundColor: "#E0E0E0",
                color: "#999",
              },
            }}
          >
            {activeStep === steps.length - 1 ? "Complete" : "Next"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StepperComponent;
