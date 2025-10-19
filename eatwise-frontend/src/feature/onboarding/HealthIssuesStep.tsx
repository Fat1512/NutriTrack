import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Card,
  CardContent,
} from "@mui/material";
import type { UserPreferences } from "./StepperComponentModern";

interface HealthIssuesStepProps {
  preferences: UserPreferences;
  updatePreference: (key: keyof UserPreferences, value: any) => void;
}

const HealthIssuesStep: React.FC<HealthIssuesStepProps> = ({
  preferences,
  updatePreference,
}) => {
  const healthIssueOptions = [
    "None",
    "Diabetes",
    "High Blood Pressure",
    "Heart Disease",
    "High Cholesterol",
    "Food Allergies",
    "Digestive Issues",
    "Thyroid Issues",
    "Other",
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
        This helps us recommend safe and suitable meal plans for you.
      </Typography>

      <FormControl
        component="fieldset"
        sx={{
          maxWidth: "400px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          component="legend"
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            fontWeight: 500,
            mb: 2,
            textAlign: "center",
          }}
        >
          Select any health considerations
        </Typography>
        <FormGroup sx={{ gap: 2 }}>
          {healthIssueOptions.map((issue) => {
            const isChecked = Array.isArray(preferences.healthIssues)
              ? preferences.healthIssues.includes(issue)
              : false;

            return (
              <Card
                key={issue}
                sx={{
                  cursor: "pointer",
                  border: isChecked ? "2px solid #000" : "2px solid #E0E0E0",
                  borderRadius: { xs: 2, md: 3 },
                  backgroundColor: isChecked ? "#F8F8F8" : "#FFFFFF",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#000",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  },
                }}
                onClick={() => {
                  const currentIssues = Array.isArray(preferences.healthIssues)
                    ? preferences.healthIssues
                    : [];

                  if (isChecked) {
                    updatePreference(
                      "healthIssues",
                      currentIssues.filter((item) => item !== issue)
                    );
                  } else {
                    updatePreference("healthIssues", [...currentIssues, issue]);
                  }
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, md: 3 },
                    "&:last-child": { pb: { xs: 2, md: 3 } },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        sx={{
                          color: "#666",
                          "&.Mui-checked": {
                            color: "#000",
                          },
                        }}
                      />
                    }
                    label={issue}
                    sx={{
                      margin: 0,
                      width: "100%",
                      "& .MuiFormControlLabel-label": {
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: isChecked ? 600 : 400,
                        color: "#000",
                        flex: 1,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default HealthIssuesStep;
