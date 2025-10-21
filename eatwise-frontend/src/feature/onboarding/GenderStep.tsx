import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface GenderStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const genderOptions = [
    { value: "male", label: "Male", icon: "👨", color: "#2196F3" },
    { value: "female", label: "Female", icon: "👩", color: "#E91E63" },
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
        This helps us personalize your meal plan and calculate your nutritional
        needs.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 2, md: 2 },
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        {genderOptions.map((option) => (
          <Card
            key={option.value}
            onClick={() => updatePreference("gender", option.value)}
            sx={{
              p: { xs: 2, md: 3 },
              cursor: "pointer",
              border:
                preferences.gender === option.value
                  ? "2px solid #000"
                  : "1px solid #E0E0E0",
              borderRadius: { xs: 3, md: 4 },
              backgroundColor:
                preferences.gender === option.value ? "#F8F8F8" : "#FFFFFF",
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
            <CardContent sx={{ p: "0 !important" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h5" sx={{ fontSize: "32px" }}>
                    {option.icon}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#000" }}
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

export default GenderStep;
