import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface MainGoalStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const MainGoalStep: React.FC<MainGoalStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const goalOptions = [
    {
      value: "lose-weight",
      label: "Lose weight",
      icon: "📉",
      color: "#FF6B35",
    },
    {
      value: "maintain-weight",
      label: "Maintain weight",
      icon: "📊",
      color: "#4ECDC4",
    },
    {
      value: "build-muscle",
      label: "Build muscle mass",
      icon: "💪",
      color: "#FF4081",
    },
    {
      value: "gain-weight",
      label: "Gain weight",
      icon: "📈",
      color: "#9C27B0",
    },
  ];

  return (
    <Box sx={{ px: { xs: 1, md: 0 } }}>
      <Typography
        variant="body1"
        sx={{
          color: "#666",
          mb: 3,
          fontSize: { xs: "16px", md: "18px" },
          textAlign: "center",
          maxWidth: "500px",
          mx: "auto",
        }}
      >
        Pick one to get started. We'll customize your meal plan based on your
        specific goal.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 2, md: 2 },
        }}
      >
        {goalOptions.map((option) => (
          <Card
            key={option.value}
            onClick={() => updatePreference("mainGoal", option.value)}
            sx={{
              p: { xs: 2, md: 3 },
              cursor: "pointer",
              border:
                preferences.mainGoal === option.value
                  ? "2px solid #000"
                  : "1px solid #E0E0E0",
              borderRadius: { xs: 3, md: 4 },
              backgroundColor:
                preferences.mainGoal === option.value ? "#F8F8F8" : "#FFFFFF",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#000",
                transform: "translateY(-4px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
              height: { xs: "auto", md: "90px" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ p: "0 !important", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: "32px", md: "40px" },
                      lineHeight: 1,
                    }}
                  >
                    {option.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#000",
                      fontSize: { xs: "18px", md: "20px" },
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default MainGoalStep;
